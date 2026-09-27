import type { Message as MessageType } from "@/types/message";
import { Message } from "../Message/Message";
import "./ChatWindow.scss";

interface ChatWindowProps {
    messages: MessageType[];
}

export const ChatWindow = ({messages}: ChatWindowProps) => {
    return (
        <ul className="messages">
            {messages.map((message) => (
                <Message
                    key={message.id}
                    message={message}
                />
            ))}
        </ul>
    );
};