import type { Message } from './message';

export interface ChatType {
    id: string;
    phone: string;
    chatId?: string; 
    name?: string;
    messages: Message[];
}