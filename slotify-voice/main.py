from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Body, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import requests
import threading
from queue import Queue
import asyncio

from pydantic import BaseModel
from services.stt import STTSession
from services.tts import synthesize_speech
from services.ai import stream_gemini_response
from services.booking import forward_transcript, end_call_api
from services.context import (
    fetch_static_context,
    cache_static_context,
    get_static_context,
    init_dynamic_context,
    get_dynamic_context,
    update_dynamic_context
)
from models.schemas import StartCallRequest
from utils.rate_limiter import booking_rate_limiter
from utils.error_handler import safe_async_call, handle_websocket_error, validate_booking_data

LARAVEL_API = "http://localhost:8000/api/v1/voice"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/incoming/start")
def start_call(data: StartCallRequest):
    try:
        resp = requests.post(
            f"{LARAVEL_API}/log",
            json={
                "caller_phone": data.caller_phone,
                "business_id": data.business_id,
                "client_id": data.client_id,
            },
        )
        resp.raise_for_status()
        call_id = str(resp.json()["data"]["call_id"])

        # Fetch and cache static business context
        static_context = fetch_static_context(data.business_id)
        if static_context:
            cache_static_context(call_id, static_context)

        # Initialize dynamic context
        init_dynamic_context(call_id)
        # Initialize conversation history for this session
        update_dynamic_context(call_id, "history", [])
        # Store client information for booking
        if data.client_id:
            update_dynamic_context(call_id, "client_id", data.client_id)
        update_dynamic_context(call_id, "business_id", data.business_id)

        return {"call_id": call_id, "reply": "Hi, thanks for calling Slotify!"}
    except Exception as e:
        return {"error": str(e), "response": getattr(e, "response", None)}

@app.post("/incoming/media/{call_id}")
def receive_audio(call_id: str):
    fake_transcript = "I want a haircut tomorrow at 5pm"
    forward_transcript(call_id, fake_transcript)
    return {"success": True, "transcript": fake_transcript}

@app.post("/incoming/end/{call_id}")
def end_call(call_id: str):
    end_call_api(call_id)
    # Clear all session-specific keys in dynamic_context for this call/session
    for key in ["history", "last_ai_response", "user_messages"]:
        update_dynamic_context(call_id, key, None)
    return {"success": True}

# -----------------------
# WebSocket Endpoint
# -----------------------
@app.websocket("/ws/call/{session_id}")
async def websocket_call(websocket: WebSocket, session_id: str):
    try:
        print(f"WebSocket connection attempt for session: {session_id}")
        await websocket.accept()
        print(f"WebSocket accepted for session: {session_id}")
        
        stt_session = STTSession()
        print(f"STTSession created for session: {session_id}")
        
        stt_session.start()
        print(f"STTSession started for session: {session_id}")
        
        greeting_sent = False
    except Exception as e:
        print(f"Error during WebSocket initialization for session {session_id}: {e}")
        import traceback
        traceback.print_exc()
        try:
            await websocket.close()
        except:
            pass
        return

    async def handle_ai_and_tts(session_id, static_context):
        try:
            dynamic_context = get_dynamic_context(session_id) or {}
            print(f"AI called for user message: {dynamic_context.get('last_user_message')}")
            buffer = ""
            ai_buffer = ""
            import json
            async for chunk in stream_gemini_response(static_context, dynamic_context, session_id):
                if not chunk or not chunk.strip():
                    continue
                buffer += chunk
                print(f"Buffer after chunk: {repr(buffer[:200])}")  # Debug: show first 200 chars of buffer
                print(f"Raw buffer after chunk: {buffer}")  # Debug: print full buffer every time
                
                # Try to parse multiple JSON objects from the buffer
                try:
                    # Handle multiple JSON objects separated by commas
                    json_str = buffer.strip()
                    if json_str.startswith('[') and not json_str.endswith(']'):
                        json_str += ']'  # Close the array if needed
                    
                    # Try to parse as JSON array
                    if json_str.startswith('[') and json_str.endswith(']'):
                        try:
                            data = json.loads(json_str)
                            if isinstance(data, list):
                                # Extract text from all objects in the array
                                for obj in data:
                                    if isinstance(obj, dict) and "candidates" in obj:
                                        for candidate in obj["candidates"]:
                                            if "content" in candidate and "parts" in candidate["content"]:
                                                for part in candidate["content"]["parts"]:
                                                    if "text" in part:
                                                        text = part["text"]
                                                        print(f"Extracted text from JSON array: {text}")
                                                        ai_buffer += text
                                # Clear buffer after successful parsing
                                buffer = ""
                        except json.JSONDecodeError:
                            # If array parsing fails, try individual objects
                            pass
                    
                    # Fallback: try to extract text using regex for partial JSON
                    if '"text":' in buffer:
                        import re
                        # Find all text values in the buffer
                        text_matches = re.findall(r'"text":\s*"([^"]*)"', buffer)
                        for text in text_matches:
                            if text and text not in ai_buffer:  # Avoid duplicates
                                print(f"Extracted text from regex: {text}")
                                ai_buffer += text
                
                except Exception as e:
                    print(f"JSON parsing error: {e}")
                    continue
            
            # Send accumulated response after loop ends
            if ai_buffer.strip():
                tts_text = ai_buffer.strip()
                print(f"Sending complete accumulated response to TTS: {tts_text}")
                tts_audio = synthesize_speech(tts_text)
                await websocket.send_bytes(tts_audio)
                await websocket.send_text(ai_buffer)
                history = dynamic_context.get("history", [])
                history.append({"role": "assistant", "content": ai_buffer})
                update_dynamic_context(session_id, "history", history)
                
            print("AI finished responding")
        except Exception as e:
            print(f"AI task error: {e}")
            # Initialize variables if they don't exist
            ai_buffer = locals().get('ai_buffer', '')
            dynamic_context = locals().get('dynamic_context') or get_dynamic_context(session_id) or {}
            
            # Try to send any accumulated response even if there was an error
            try:
                if ai_buffer and ai_buffer.strip():
                    tts_text = ai_buffer.strip()
                    print(f"Sending complete response to TTS after error: {repr(tts_text)}")
                    tts_audio = synthesize_speech(tts_text)
                    await websocket.send_bytes(tts_audio)
                    await websocket.send_text(ai_buffer)
                    
                    # Save to history
                    history = dynamic_context.get("history", [])
                    history.append({"role": "assistant", "content": ai_buffer})
                    update_dynamic_context(session_id, "history", history)
            except Exception as inner_e:
                print(f"Error sending response after main error: {inner_e}")
                    
            print("AI finished responding")

    try:
        while True:
            try:
                chunk = await websocket.receive_bytes()
                stt_session.chunk_queue.put(chunk)

                static_context = get_static_context(session_id)
                if not static_context:
                    # Try to extract business_id from session_id if it follows pattern business_id-session
                    if "-" in session_id:
                        try:
                            business_id = int(session_id.split("-")[0])
                            print(f"[INFO] Extracted business_id {business_id} from session_id {session_id}")
                            static_context = fetch_static_context(business_id)
                            if static_context:
                                cache_static_context(session_id, static_context)
                            else:
                                print(f"[ERROR] Failed to fetch static context for business_id {business_id}")
                                static_context = {}
                        except (ValueError, IndexError) as e:
                            print(f"[ERROR] Could not extract business_id from session_id {session_id}: {e}")
                            static_context = {}
                    else:
                        print(f"[ERROR] No static context found for session {session_id} and cannot extract business_id")
                        static_context = {}
                
                dynamic_context = get_dynamic_context(session_id) or {}

                # Send greeting once
                if not greeting_sent:
                    business_name = static_context.get("name", "this business")
                    greeting_text = f"Welcome to {business_name}, how can I help you?"
                    try:
                        tts_audio = synthesize_speech(greeting_text)
                        await websocket.send_bytes(tts_audio)
                        greeting_sent = True
                    except Exception as e:
                        print(f"Error in greeting TTS for session {session_id}: {e}")
                        greeting_sent = True  # Skip greeting on error

                while not stt_session.transcript_queue.empty():
                    transcript, is_final = stt_session.transcript_queue.get()
                    transcript_clean = transcript.strip()
                    if not transcript_clean or len(transcript_clean) < 2:
                        continue
                    await websocket.send_text(transcript_clean)

                    if is_final:
                        try:
                            # LLM intent detection and entity extraction
                            from services.intent import detect_intent_llm
                            from services.booking import create_booking, get_service_mapping
                            
                            print(f"[DEBUG] Transcript received: {transcript_clean}")
                            business_id = static_context.get("id") or static_context.get("business_id")
                            print(f"[DEBUG] Static context keys: {list(static_context.keys())}")
                            print(f"[DEBUG] Business ID found: {business_id}")
                            
                            # Safe service mapping with timeout
                            service_mapping = {}
                            if business_id:
                                try:
                                    service_mapping = get_service_mapping(business_id)
                                    print(f"[DEBUG] Service mapping retrieved: {service_mapping}")
                                except Exception as e:
                                    print(f"[ERROR] Service mapping failed: {e}")
                            else:
                                print(f"[WARNING] No business_id found in static_context")
                            
                            # Get conversation history for context
                            conversation_history = dynamic_context.get("history", []) if dynamic_context else []
                            
                            result = await detect_intent_llm(transcript_clean, service_mapping=service_mapping, conversation_history=conversation_history)
                            print(f"[DEBUG] LLM intent result: {result}")
                            intent = result.get("intent")
                            entities = result.get("entities", {})

                            # Handle different intents
                            if intent == "booking":
                                # Immediate TTS acknowledgment for booking attempts
                                acknowledgment_text = "Let me see what we have available..."
                                try:
                                    tts_audio = synthesize_speech(acknowledgment_text)
                                    await websocket.send_bytes(tts_audio)
                                    await websocket.send_text(acknowledgment_text)
                                except Exception as e:
                                    print(f"[ERROR] TTS acknowledgment failed: {e}")
                                
                                # Check rate limiting
                                can_book, reason = booking_rate_limiter.can_attempt_booking(session_id)
                                if not can_book:
                                    print(f"[RATE_LIMIT] Booking blocked for session {session_id}: {reason}")
                                    update_dynamic_context(session_id, "last_booking_result", {"error": reason})
                                else:
                                    # Validate booking data
                                    client_id = dynamic_context.get("client_id") if dynamic_context else None
                                    is_valid, error_msg = validate_booking_data(
                                        business_id, 
                                        entities.get('date'), 
                                        entities.get('time'), 
                                        entities.get('service_id'),
                                        client_id
                                    )
                                    
                                    if not is_valid:
                                        print(f"[VALIDATION] Booking validation failed: {error_msg}")
                                        update_dynamic_context(session_id, "last_booking_result", {"error": error_msg})
                                        booking_rate_limiter.record_attempt(session_id, success=False)
                                    else:
                                        # Attempt booking with error handling
                                        try:
                                            print(f"[DEBUG] Calling create_booking with: business_id={business_id}, date={entities.get('date')}, time={entities.get('time')}, service_id={entities.get('service_id')}, client_id={client_id}")
                                            
                                            booking_response = create_booking(
                                                business_id,
                                                entities.get("date"),
                                                entities.get("time"),
                                                entities.get("service_id"),
                                                client_id=client_id
                                            )
                                            
                                            print(f"[DEBUG] Booking API response: {booking_response}")
                                            update_dynamic_context(session_id, "last_booking_result", booking_response)
                                            booking_rate_limiter.record_attempt(session_id, success=True)
                                            
                                        except Exception as booking_error:
                                            print(f"[ERROR] Booking failed: {booking_error}")
                                            update_dynamic_context(session_id, "last_booking_result", {"error": str(booking_error)})
                                            booking_rate_limiter.record_attempt(session_id, success=False)
                                
                                # Update context and generate AI response with booking result
                                try:
                                    history = dynamic_context.get("history", [])
                                    history.append({"role": "user", "content": transcript_clean})
                                    update_dynamic_context(session_id, "history", history)
                                    update_dynamic_context(session_id, "last_user_message", transcript_clean)
                                    
                                    # AI response with booking context
                                    asyncio.create_task(handle_ai_and_tts(session_id, static_context))
                                except Exception as e:
                                    print(f"[ERROR] Booking context update failed: {e}")
                            
                            else:
                                # For non-booking intents (service_inquiry, general_question, etc.)
                                # Let AI handle immediately - no booking process needed
                                try:
                                    history = dynamic_context.get("history", [])
                                    history.append({"role": "user", "content": transcript_clean})
                                    update_dynamic_context(session_id, "history", history)
                                    update_dynamic_context(session_id, "last_user_message", transcript_clean)
                                    
                                    # Normal AI response
                                    asyncio.create_task(handle_ai_and_tts(session_id, static_context))
                                except Exception as e:
                                    print(f"[ERROR] AI task creation failed: {e}")

                            # Safe transcript forwarding
                            try:
                                forward_transcript(session_id, transcript_clean)
                            except Exception as e:
                                print(f"[ERROR] Forward transcript failed: {e}")
                                
                        except Exception as intent_error:
                            print(f"[ERROR] Intent processing failed: {intent_error}")
                            await handle_websocket_error(websocket, session_id, intent_error)
            except Exception as e:
                print(f"Error processing WebSocket data for session {session_id}: {e}")
                import traceback
                traceback.print_exc()
                # Continue the loop to handle more data
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for session {session_id}")
        try:
            stt_session.stop()
        except:
            pass
        while not stt_session.transcript_queue.empty():
            transcript, is_final = stt_session.transcript_queue.get()
            try:
                await websocket.send_text(transcript)
                if is_final:
                    forward_transcript(session_id, transcript)
            except:
                break
    except Exception as e:
        print(f"Unexpected error in WebSocket for session {session_id}: {e}")
        import traceback
        traceback.print_exc()
        try:
            stt_session.stop()
        except:
            pass
        try:
            await websocket.close()
        except:
            pass