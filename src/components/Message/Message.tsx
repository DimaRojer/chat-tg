import type { Message as MessageType } from "@/types/message";
import "./Message.scss";

interface MessageProps {
    message: MessageType;
}

export const Message = ({ message }: MessageProps) => {
    const rawText = message.text || "";
    return (
        <li
            className={`message ${
                message.isOwn ? "message--outgoing" : "message--incoming"
            }`}
        >
            <div className="message__body">
                <div className="message__text">
                    {rawText.split("\n").map((line, index) => {
                        const formatted = line
                        .replace(/\*(.*?)\*/g, "<strong>$1</strong>")
                        .replace(/^>\s?(.*)/, "<span class='quote'>$1</span>");
                        return (
                            <div
                                key={index}
                                dangerouslySetInnerHTML={{
                                __html: formatted,
                                }}
                            />
                        );
                    })}
                </div>
                <span className="message__time">{message.time}</span>
            </div>
        </li>
    );
};