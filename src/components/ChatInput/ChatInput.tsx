import { Btn } from "@/components/ui/Btn/Btn";
import { useState } from "react";
import "./ChatInput.scss";

interface ChatInputProps {
    onSend: (text: string) => void;
}

export const ChatInput = ({onSend}: ChatInputProps) => {
    const [text, setText] = useState("");
    const send = () => {
        if (!text.trim()) return;
        onSend(text);
        setText("");
    };

    return(
        <div className="chat-input">
            <div className="chat-input__wrapper">
                <input
                    className="chat-input__input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Введите сообщение"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            send();
                        }
                    }}
                />
                <Btn onClick={send}>Отправить</Btn>
            </div>
        </div>
    );
};