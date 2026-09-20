import React from 'react';

interface TactileCardProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  isInteractive?: boolean;
}

export function TactileCard({
  id,
  className = '',
  children,
  onClick,
  href,
  isInteractive = false,
}: TactileCardProps) {
  const baseClasses = `
    relative border border-white/[0.03] from-[#1a1a1a] to-[#131313] bg-gradient-to-br 
    shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_1px_3px_rgba(0,0,0,0.3),_inset_0_-1px_1px_rgba(0,0,0,0.2)] 
    transition-all duration-500 
    before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent before:opacity-0 before:transition-opacity 
    after:absolute after:inset-0 after:z-[-1] after:rounded-2xl after:bg-gradient-to-t after:from-black/30 after:to-transparent 
    rounded-xl
    ${isInteractive ? 'cursor-pointer hover:border-white/10 hover:before:opacity-100 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_6px_20px_rgba(0,0,0,0.5),_inset_0_-1px_1px_rgba(0,0,0,0.2)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]' : ''}
    ${className}
  `.trim();

  if (href) {
    return (
      <a
        id={id}
        data-slot="card"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        className={`flex w-full items-center justify-between px-4 py-3 text-[#d8d8d8] no-underline ${baseClasses}`}
      >
        {children}
      </a>
    );
  }

  if (onClick) {
    return (
      <button
        type="button"
        id={id}
        data-slot="card"
        onClick={onClick}
        className={`flex w-full items-center justify-between px-4 py-3 text-left text-[#d8d8d8] ${baseClasses}`}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      id={id}
      data-slot="card"
      className={`${baseClasses}`}
    >
      {children}
    </div>
  );
}
