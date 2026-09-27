import type { ChatType } from "@/types/chat";

import "./ChatItem.scss";


interface ChatItemProps {
    chat: ChatType;
    onClick: () => void;
}

export const ChatItem = ({
    chat,
    onClick,
}: ChatItemProps) => {
const displayName = chat.name || chat.phone;
    return (
        <li className="chat-item">
            <button className="chat-item__link" onClick={onClick}>
                <div className="chat-item__icon chat-item__icon--green">{displayName.slice(-2)}</div>
                <div className="flex flex-col justify-between w-full">
                    <div className="flex justify-between">
                        <div className="chat-item__name">{displayName}</div>
                    </div>
                    <div className="flex justify-between">
                        <div className="chat-item__text">Нет сообщений</div>
                        <div className="chat-item__count">0</div>
                    </div>
                </div>
            </button>
        </li>
    );
};