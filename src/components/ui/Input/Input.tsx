import type { InputHTMLAttributes } from 'react';

import './Input.scss';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    value: string;
    onChange: (value: string) => void;
}

export const Input = ({
    value,
    onChange,
    ...props
}: InputProps) => {
    return (
        <input
            className="input"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            {...props}
        />
    );
};