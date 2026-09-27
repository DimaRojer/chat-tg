import type { ButtonHTMLAttributes, ReactNode } from 'react';
import "./Btn.scss";

interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
}

export const Btn = ({ children, ...props }: BtnProps) => {
    return (
        <button className="btn-main" {...props}>
            {children}
        </button>
    );
};