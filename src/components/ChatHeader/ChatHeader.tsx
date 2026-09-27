import type { ChatType } from "@/types/chat";
import "./ChatHeader.scss";

interface ChatHeaderProps {
    chat: ChatType;
}

export const ChatHeader = ({
    chat,
}: ChatHeaderProps) => {
    return (
        <header className="chat-header">
            <div className="flex items-center gap-12">
                <div className="chat-item__icon chat-item__icon--green">
                    {chat.phone.slice(-2)}
                </div>
                <div className="flex flex-col gap-2">
                    <div className="chat-item__name">{chat.name}</div>
                    <div className="chat-item__text">{chat.phone}</div>
                </div>
            </div>
        </header>
    );
};