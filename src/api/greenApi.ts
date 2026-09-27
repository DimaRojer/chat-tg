const getBaseUrl = () => {
    const idInstance = localStorage.getItem("idInstance");
    return `/green-api/waInstance${idInstance}`;
};

const getToken = () => localStorage.getItem("apiTokenInstance") || "";

export const configureInstanceSettings = async () => {
    const url = `${getBaseUrl()}/setSettings/${getToken()}`;

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                webhookUrl: "",
                incomingWebhook: "yes",
                outgoingWebhook: "yes",
                stateInstanceWebhook: "yes",
                deviceWebhook: "no",
            }),
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        console.log("SETTINGS UPDATE RESULT:", data);
    } catch (error) {
        console.error("FAILED TO SET SETTINGS:", error);
    }
};

export const receiveNotification = async () => {
    try {
        const response = await fetch(
            `${getBaseUrl()}/receiveNotification/${getToken()}`
        );

        if (!response.ok) return null;

        const text = await response.text();

        if (!text) return null;

        return JSON.parse(text);
    } catch (error) {
        console.error("RECEIVE ERROR:", error);
        return null;
    }
};

export const deleteNotification = async (receiptId: number) => {
    if (!receiptId) return;

    try {
        const res = await fetch(
            `${getBaseUrl()}/deleteNotification/${getToken()}/${receiptId}`,
            {
                method: "DELETE",
            }
        );

        if (!res.ok) {
            console.warn("DELETE FAILED", res.status, receiptId);
        }
    } catch (error) {
        console.error("DELETE ERROR:", error);
    }
};

const chatIdCache = new Map<string, string>();

export const checkAccount = async (
    phone: string
): Promise<string | null> => {
    const cleanPhone = phone.replace(/\D/g, "");

    if (!cleanPhone) return null;

    if (chatIdCache.has(cleanPhone)) {
        return chatIdCache.get(cleanPhone)!;
    }

    try {
        const res = await fetch(
            `${getBaseUrl()}/checkAccount/${getToken()}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phoneNumber: Number(cleanPhone),
                }),
            }
        );

        if (!res.ok) return null;

        const data = await res.json();

        if (data?.exist && data?.chatId) {
            const chatId = String(data.chatId);

            chatIdCache.set(cleanPhone, chatId);

            return chatId;
        }

        return null;
    } catch (error) {
        console.error("checkAccount error:", error);
        return null;
    }
};

export const sendMessage = async (
    phone: string,
    text: string,
    knownChatId?: string
) => {
    const chatId = knownChatId ?? (await checkAccount(phone));

    if (!chatId) {
        throw new Error("NO_ACCOUNT");
    }

    const response = await fetch(
        `${getBaseUrl()}/sendMessage/${getToken()}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chatId,
                message: text,
            }),
        }
    );

    if (!response.ok) {
        const errorText = await response.text().catch(() => "");

        throw new Error(
            `sendMessage failed: ${response.status} ${errorText}`
        );
    }

    const data = await response.json();

    return {
        ...data,
        chatId,
    };
};

const lidCache = new Map<string, string>();

export const resolvePhoneByChatId = async (
    chatId: string
): Promise<string | null> => {
    if (!chatId) return null;

    if (lidCache.has(chatId)) {
        return lidCache.get(chatId)!;
    }

    try {
        const res = await fetch(
            `${getBaseUrl()}/getContactInfo/${getToken()}?chatId=${encodeURIComponent(
                chatId
            )}`
        );

        if (!res.ok) {
            console.warn("getContactInfo failed:", res.status);
            return null;
        }

        const data = await res.json();

        const raw = data?.phoneNumber ?? data?.chatId ?? "";
        const phone = String(raw).replace(/\D/g, "");

        if (!phone) return null;

        lidCache.set(chatId, phone);

        return phone;
    } catch (error) {
        console.error("resolvePhoneByChatId error:", error);
        return null;
    }
};

export const normalizePhone = (raw: string): string => {
    let phone = String(raw).replace(/\D/g, "");

    if (phone.startsWith("8") && phone.length === 11) {
        phone = "7" + phone.slice(1);
    }

    return phone;
};