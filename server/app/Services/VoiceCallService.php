<?php

namespace App\Services;

use App\Models\VoiceCall;

class VoiceCallService
{
    public function logCall($data)
    {
        return VoiceCall::create($data);
    }

    public function updateTranscript($id, $transcript)
    {
        $call = VoiceCall::findOrFail($id);
        $call->update(['transcript' => $transcript]);
        return $call;
    }

    public function endCall($id)
    {
        $call = VoiceCall::findOrFail($id);
        $call->update(['status' => 'ended']);
        return $call;
    }
}
