import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import {
  configureInstanceSettings,
  sendMessage as sendGreenMessage,
} from "@/api/greenApi";
import { Chat } from "@/components/Chat/Chat";
import type { ChatType } from "@/types/chat";

const getFriendlyError = (error: unknown): string => {
  const raw = error instanceof Error ? error.message : String(error);

  if (raw.includes("NO_TELEGRAM_ACCOUNT")) {
    return "У этого номера не найден аккаунт Telegram.";
  }

  if (
    raw.includes("QUOTE_ALLOWED") ||
    raw.includes("CORRESPONDENTS_QUOTE_EXCEEDED") ||
    raw.toLowerCase().includes("quota")
  ) {
    return "Превышен месячный лимит собеседников на текущем тарифе Green API. Смените тариф в личном кабинете или пишите только уже разрешённым номерам.";
  }

  return "Не удалось отправить сообщение. Попробуйте ещё раз.";
};

export default function ChatPage() {
  const { chatId: routeId } = useParams();
  const { chats, setChats } = useOutletContext<{
    chats: ChatType[];
    setChats: React.Dispatch<React.SetStateAction<ChatType[]>>;
  }>();

  const [sendError, setSendError] = useState<string | null>(null);

  const chat = chats.find((item) => item.id === routeId);

  useEffect(() => {
    configureInstanceSettings();
  }, []);


  useEffect(() => {
  }, [routeId]);

  if (!chat) {
    return <div>Чат не найден</div>;
  }

  const sendMessage = async (text: string) => {
    setSendError(null);

    setChats((prev) =>
      prev.map((item) => {
        if (item.id !== routeId) return item;
        return {
          ...item,
          messages: [
            ...item.messages,
            {
              id: crypto.randomUUID(),
              text,
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              isOwn: true,
            },
          ],
        };
      })
    );

    try {
      const res = await sendGreenMessage(chat.phone, text, chat.chatId);
      if (res?.chatId && res.chatId !== chat.chatId) {
        setChats((prev) =>
          prev.map((item) =>
            item.id === routeId ? { ...item, chatId: res.chatId } : item
          )
        );
      }
    } catch (error) {
      console.error("Ошибка при отправке сообщения:", error);
      setSendError(getFriendlyError(error));
    }
  };

  return (
    <Chat
      chat={chat}
      onSend={sendMessage}
      error={sendError}
      onDismissError={() => setSendError(null)}
    />
  );
}
