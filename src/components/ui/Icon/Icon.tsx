interface IconProps {
    name: string;
    size?: number;
    className?: string;
}

export function Icon({
    name,
    size = 24,
    className = '',
}: IconProps) {
    return (
        <svg className={className} width={size} height={size}>
            <use href={`./symbols.svg#${name}`} />
        </svg>
    );
}