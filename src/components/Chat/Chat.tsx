import type { ChatType } from "@/types/chat";
import { ChatHeader } from "../ChatHeader/ChatHeader";
import { ChatInput } from "../ChatInput/ChatInput";
import { ChatWindow } from "../ChatWindow/ChatWindow";
import "./Chat.scss";

interface ChatProps {
    chat: ChatType;
    onSend: (text: string) => void;
    error?: string | null;
    onDismissError?: () => void;
}

export const Chat = ({
    chat,
    onSend,
    error,
    onDismissError,
}: ChatProps) => {
    if (!chat) {
        return (
            <div className="chat">
                <div className="chat__empty">
                    Выберите чат для начала общения
                </div>
            </div>
        );
    }

    return (
        <div className="chat">
            <div className="chat__wrapper">
                <ChatHeader chat={chat}/>
                <ChatWindow messages={chat.messages}/>
                {error && (
                    <div className="chat__error">
                        <span>{error}</span>
                        {onDismissError && (
                            <button
                                className="chat__error-close"
                                onClick={onDismissError}
                                aria-label="Скрыть ошибку"
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}
                <ChatInput onSend={onSend}/>
            </div>
        </div>
    );
};
