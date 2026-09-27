import { useState } from 'react';

import { Btn } from '@/components/ui/Btn/Btn';
import { Input } from '@/components/ui/Input/Input';

import './NewChatModal.scss';
import { Icon } from '../ui/Icon/Icon';

interface NewChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (phone: string) => void;
}

export const NewChatModal = ({
    isOpen,
    onClose,
    onCreate,
}: NewChatModalProps) => {
    const [phone, setPhone] = useState('');

    if (!isOpen) return null;

    const createChat = () => {
        if (!phone.trim()) return;
        onCreate(phone);
        setPhone('');
        onClose();
    };

    return (
        <div className="new-chat">
            <div className="new-chat__overlay" onClick={onClose}/>
            <div className="new-chat__content">
                <div className="new-chat__header">
                    <h2>Новый чат</h2>
                    <button className="new-chat__close" onClick={onClose}>
						<Icon className="rotate-45" name="plus"/>
					</button>
                </div>
                <div className="new-chat__body">
                    <div className="new-chat__field">
                        <label>Номер телефона</label>
                        <Input value={phone} onChange={setPhone} placeholder="+7 999 123-45-67"/>
                    </div>
                    <div className="new-chat__actions">
                        <Btn onClick={onClose}>Отмена</Btn>
                        <Btn onClick={createChat}>Создать чат</Btn>
                    </div>
                </div>
            </div>
        </div>
    );
};