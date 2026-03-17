"use client";
import React from 'react';

interface PillProps {
    text: string;
}

const Pill: React.FC<PillProps> = ({ text }) => {
    return (
        <div className="inline-flex items-center px-6 py-2 rounded-full border border-primary-green bg-primary-green/20 text-white font-medium text-sm">
            {text}
        </div>
    );
};

export default Pill;
