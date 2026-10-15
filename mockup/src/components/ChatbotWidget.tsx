import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import { getBotReply, CHAT_SUGGESTIONS } from "../features/chat/chatbotEngine";

interface ChatMessage {
  id: number;
  from: "user" | "bot";
  text: string;
}

let msgSeq = 0;

const INITIAL: ChatMessage[] = [
  { id: ++msgSeq, from: "bot", text: "¡Hola! Soy el asistente de STADIO. ¿En qué puedo ayudarte?" },
];

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setMessages((m) => [...m, { id: ++msgSeq, from: "user", text }]);
    setInput("");
    window.setTimeout(() => {
      setMessages((m) => [...m, { id: ++msgSeq, from: "bot", text: getBotReply(text) }]);
    }, 300);
  };

  const showSuggestions = messages.length <= 1;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-[80] grid h-14 w-14 place-items-center rounded-full bg-stadio-red text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label={open ? "Cerrar asistente" : "Abrir asistente"}
      >
        {open ? <X size={22} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-5 z-[80] flex h-[28rem] w-[min(92vw,22rem)] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl dark:border-white/10 dark:bg-stadio-black">
          <div className="flex items-center gap-2 bg-gradient-to-br from-stadio-red to-red-800 px-4 py-3 text-white">
            <MessageCircle size={18} />
            <div>
              <p className="text-sm font-bold leading-none">Asistente STADIO</p>
              <p className="mt-0.5 text-[11px] text-white/70">Respuestas sobre el gimnasio</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <p
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    m.from === "user"
                      ? "rounded-br-sm bg-stadio-red text-white"
                      : "rounded-bl-sm bg-stadio-gray-light text-stadio-black dark:bg-white/10 dark:text-white"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}

            {showSuggestions && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {CHAT_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-gray-200 px-2.5 py-1 text-[11px] font-semibold text-stadio-gray-dark transition-colors hover:border-stadio-red/40 hover:text-stadio-red dark:border-white/15 dark:text-white/60"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-gray-100 p-2.5 dark:border-white/10"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta…"
              className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-stadio-black placeholder:text-stadio-gray focus:outline-none focus:ring-2 focus:ring-red-500/40 dark:border-white/15 dark:bg-white/5 dark:text-white"
            />
            <button
              type="submit"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-stadio-red text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              disabled={!input.trim()}
              aria-label="Enviar"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
