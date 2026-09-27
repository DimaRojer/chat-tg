import { Icon } from '../Icon/Icon';

import './Search.scss';

interface SearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export const Search = ({
    value,
    onChange,
    placeholder = "Поиск",
}: SearchProps) => {
    return (
        <div className="search">
            <Icon name="search" size={20} className="search__icon"/>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};