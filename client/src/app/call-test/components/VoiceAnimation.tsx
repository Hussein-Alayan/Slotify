import { MessageSquare } from "lucide-react";

interface VoiceAnimationProps {
  isAISpeaking: boolean;
}

export function VoiceAnimation({ isAISpeaking }: VoiceAnimationProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      {isAISpeaking ? (
        <div className="flex gap-2 items-end h-20">
          {/* Simple animated bars */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="bg-blue-500 rounded-sm w-4 animate-wavebar"
              style={{
                height: `${12 + Math.random() * 32}px`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <MessageSquare className="h-12 w-12 mb-3 text-gray-300" />
          <p className="text-center text-sm font-medium">
            Waiting for AI to speak...
          </p>
        </div>
      )}
      <style jsx>{`
        @keyframes wavebar {
          0%,
          100% {
            height: 16px;
          }
          50% {
            height: 56px;
          }
        }
        .animate-wavebar {
          animation: wavebar 1.2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
