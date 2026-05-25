import React from 'react';
import { IconType } from 'react-icons';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
    size?: 'sm' | 'md' | 'lg';
    icon?: IconType;
    iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'right',
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        primary: 'bg-primary-green text-white hover:bg-accent-green-success focus:ring-primary-green shadow-lg',
        secondary: 'bg-primary-blue text-white hover:brightness-110 focus:ring-primary-blue shadow-lg',
        outline: 'border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-white focus:ring-primary-green',
        ghost: 'text-white hover:bg-white/10 focus:ring-white',
        white: 'bg-white text-primary-green hover:bg-gray-100 focus:ring-white shadow-lg',
    };

    const sizes = {
        sm: 'px-4 py-1.5 text-sm',
        md: 'px-8 py-4 text-base',
        lg: 'px-10 py-5 text-lg',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {Icon && iconPosition === 'left' && <Icon className="mr-2 h-5 w-5" />}
            {children}
            {Icon && iconPosition === 'right' && <Icon className="ml-2 h-5 w-5" />}
        </button>
    );
};

export default Button;
