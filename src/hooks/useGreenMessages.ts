import { useEffect, useRef } from "react";
import {
    receiveNotification,
    deleteNotification,
    resolvePhoneByChatId,
    normalizePhone,
} from "@/api/greenApi";
import type { ChatType } from "@/types/chat";
import type { GreenWebhookBody } from "@/types/green";

interface Props {
    setChats: React.Dispatch<React.SetStateAction<ChatType[]>>;
    autoCreateChats?: boolean;
}

const parseBody = (
    raw: GreenWebhookBody | string | undefined
): GreenWebhookBody | null => {
    if (!raw) return null;

    if (typeof raw === "string") {
        try {
            return JSON.parse(raw) as GreenWebhookBody;
        } catch {
            return null;
        }
    }

    return raw;
};

export const useGreenMessages = ({
    setChats,
    autoCreateChats = true,
}: Props) => {
    const pollingRef = useRef(false);

    useEffect(() => {
        if (pollingRef.current) return;

        pollingRef.current = true;
        let isCancelled = false;

        const handleIncoming = async (body: GreenWebhookBody) => {
            const chatId = String(body?.senderData?.chatId || "");
            if (!chatId) return;
            const md = body.messageData;
            const text =
                md?.textMessageData?.textMessage ||
                md?.extendedTextMessageData?.text ||
                (md?.typeMessage === "imageMessage"
                    ? "[изображение]"
                    : "");
            if (!text) return;
            let incomingPhone: string | null = null;
            const resolved = await resolvePhoneByChatId(chatId);
            if (resolved) incomingPhone = normalizePhone(resolved);
            if (isCancelled) return;
            setChats((prev) => {
                const idx = prev.findIndex((chat) => {
                    if (chat.chatId === chatId) return true;
                    if (
                        incomingPhone &&
                        normalizePhone(chat.phone) === incomingPhone
                    ) {
                        return true;
                    }
                    return false;
                });
                const newMessage = {
                    id: body.idMessage || crypto.randomUUID(),
                    text,
                    time: new Date().toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    isOwn: false,
                };
                if (idx === -1) {
                    if (!autoCreateChats) return prev;
                    return [
                        ...prev,
                        {
                            id: crypto.randomUUID(),
                            phone: incomingPhone ?? "",
                            chatId,
                            name: body?.senderData?.senderName || chatId,
                            messages: [newMessage],
                        },
                    ];
                }
                return prev.map((chat, index) =>
                    index === idx
                        ? {
                              ...chat,
                              chatId: chat.chatId ?? chatId,
                              phone: chat.phone || incomingPhone || "",
                              name:
                                  body?.senderData?.senderName ||
                                  chat.name ||
                                  incomingPhone ||
                                  chatId,
                              messages: [...chat.messages, newMessage],
                          }
                        : chat
                );
            });
        };

        const poll = async () => {
            while (!isCancelled) {
                try {
                    const data = await receiveNotification();
                    if (isCancelled) break;
                    if (!data) {
                        await new Promise((resolve) =>
                            setTimeout(resolve, 1500)
                        );
                        continue;
                    }
                    const body = parseBody(data.body);
                    if (body?.typeWebhook === "incomingMessageReceived") {
                        await handleIncoming(body);
                    }
                    if (data.receiptId) {
                        await deleteNotification(data.receiptId);
                    }
                } catch (error) {
                    console.error("Polling error:", error);
                    await new Promise((resolve) =>
                        setTimeout(resolve, 3000)
                    );
                }
            }
        };
        poll();
        return () => {
            isCancelled = true;
            pollingRef.current = false;
        };
    }, [setChats, autoCreateChats]);
};