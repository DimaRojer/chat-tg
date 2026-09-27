'use client'

import { useMemo, useState } from "react";

import { Icon } from '@/components/ui/Icon/Icon';
import { Search } from '@/components/ui/Search/Search';
import { Btn } from "../ui/Btn/Btn";
import { ChatItem } from "@/components/ChatItem/ChatItem";
import { NewChatModal } from "../NewChatModal/NewChatModal";
import { useNavigate } from "react-router-dom";
import type { ChatType } from "@/types/chat";

import "./ChatList.scss";

interface ChatListProps {
    chats: ChatType[];
    createChat: (phone: string) => void;
    selectChat: (chat: ChatType) => void;
}

export const ChatList = ({
    chats,
    createChat,
}: ChatListProps) => {
    const navigate = useNavigate();
    const [isNewChatOpen, setIsNewChatOpen] = useState(false);
    const [query, setQuery] = useState("");
    const filteredChats = useMemo(() => {
        const trimmed = query.trim().toLowerCase();
        if (!trimmed) return chats;
        const digitsQuery = trimmed.replace(/\D/g, "");
        return chats.filter((chat) => {
            const nameMatch = (chat.name ?? "").toLowerCase().includes(trimmed);
            const phoneMatch = digitsQuery.length > 0 && chat.phone.includes(digitsQuery);
            return nameMatch || phoneMatch;
        });
    }, [chats, query]);
    return (
        <>
            <aside className="chat-list">
                <div className="chat-list__top">
                    <div className="chat-list__header">
                        <h1 className="title"> ChatTGApi</h1>
                        <button>
                            <Icon name="search"/>
                        </button>
                    </div>
                    <div className="px-16 flex flex-col gap-12">
                        <Search
                            value={query}
                            onChange={setQuery}
                        />
                        <Btn onClick={() => setIsNewChatOpen(true)}>
                            <Icon name="plus"/>
                            <span>Новый чат</span>
                        </Btn>
                    </div>
                </div>
                <ul className="chat-list__list">
                    {filteredChats.length === 0 ? (
                        <div className="py-12 mx-16">
                            {query.trim() ? "Ничего не найдено" : "Нет чатов"}
                        </div>
                    ) : (
                        filteredChats.map((chat) => (
                            <ChatItem
                                key={chat.id}
                                chat={chat}
                                onClick={() => navigate(`/main/${chat.id}`)}
                            />
                        ))
                    )}
                </ul>
            </aside>
            <NewChatModal
                isOpen={isNewChatOpen}
                onClose={() => setIsNewChatOpen(false)}
                onCreate={createChat}
            />
        </>
    );
};