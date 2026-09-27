export interface GreenTextMessageData {
  textMessage?: string;
}

export interface GreenExtendedTextMessageData {
  text?: string;
}

export interface GreenMessageData {
  typeMessage?: string;
  textMessageData?: GreenTextMessageData;
  extendedTextMessageData?: GreenExtendedTextMessageData;
}

export interface GreenSenderData {
  chatId?: string;
  sender?: string;
  senderName?: string;
}

export interface GreenWebhookBody {
  typeWebhook?: string;
  idMessage?: string;
  messageData?: GreenMessageData;
  senderData?: GreenSenderData;
}

export interface GreenNotification {
  receiptId?: number;
  body?: GreenWebhookBody | string;
}

export interface GreenContactInfo {
  phoneNumber?: number | string;
  chatId?: string;
}