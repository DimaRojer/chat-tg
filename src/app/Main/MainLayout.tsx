import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ChatList } from "@/components/ChatList/ChatList";
import { useGreenMessages } from "@/hooks/useGreenMessages";
import { checkAccount, normalizePhone } from "@/api/greenApi";
import type { ChatType } from "@/types/chat";

export const MainLayout = () => {
  const navigate = useNavigate();

  const [chats, setChats] = useState<ChatType[]>(() => {
    const saved = localStorage.getItem("chats");
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });
  const [activeChat, setActiveChat] = useState<ChatType | null>(null);

  // ЕДИНСТВЕННЫЙ polling на всё приложение
  useGreenMessages({ setChats });

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const createChat = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone) return;

    const normalized = normalizePhone(cleanPhone);

    // не плодим дубликаты одного и того же контакта по номеру телефона
    const existing = chats.find((c) => normalizePhone(c.phone) === normalized);
    if (existing) {
      setActiveChat(existing);
      navigate(`/main/${existing.id}`);
      return;
    }

    const chat: ChatType = {
      id: crypto.randomUUID(),
      phone: cleanPhone,
      messages: [],
    };

    setChats((prev) => [...prev, chat]);
    setActiveChat(chat);
    navigate(`/main/${chat.id}`);

    // Резолвим настоящий Telegram chatId сразу, не дожидаясь первой отправки.
    // Это нужно, чтобы входящие сообщения от собеседника матчились именно
    // с этим чатом, а не создавали дубликат через autoCreateChats.
    void checkAccount(cleanPhone).then((chatId) => {
      if (!chatId) return;
      setChats((prev) =>
        prev.map((c) => (c.id === chat.id ? { ...c, chatId } : c))
      );
    });
  };

  const selectChat = (chat: ChatType) => {
    setActiveChat(chat);
  };

  return (
    <div className="page-wrapper">
      <ChatList
        chats={chats}
        createChat={createChat}
        selectChat={selectChat}
      />
      <Outlet
        context={{
          chats,
          setChats,
          activeChat,
          setActiveChat,
        }}
      />
    </div>
  );
};
