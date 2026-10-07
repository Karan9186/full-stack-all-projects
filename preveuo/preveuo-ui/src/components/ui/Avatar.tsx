'use client';

import React from 'react';
import Image from 'next/image';

/**
 * Avatar & AvatarGroup
 *
 * Implements Rule 26 of Common UI Component Architecture Rules:
 * - Avatar image / initials fallback
 * - Status indicator dot
 * - AvatarGroup with overflow indicator
 */

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  name,
  size = 'md',
  status,
  className = '',
  ...props
}) => {
  const [imgError, setImgError] = React.useState(false);

  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-[12px]',
    md: 'w-10 h-10 text-[14px]',
    lg: 'w-12 h-12 text-[16px]',
    xl: 'w-16 h-16 text-[20px]',
  };

  const statusStyles = {
    online: 'bg-emerald-500',
    offline: 'bg-gray-400',
    busy: 'bg-rose-500',
    away: 'bg-amber-500',
  };

  const getInitials = (n?: string) => {
    if (!n) return '?';
    const parts = n.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 select-none overflow-hidden bg-[#5B5CE2]/10 text-[#5B5CE2] font-semibold ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {src && !imgError ? (
        <Image
          src={src}
          alt={alt || name || 'Avatar'}
          fill
          sizes="(max-width: 768px) 40px, 64px"
          className="object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span>{getInitials(name || alt)}</span>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ring-1 ring-black/5 ${statusStyles[status]}`}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  max = 4,
  size = 'sm',
  children,
  className = '',
  ...props
}) => {
  const childrenArray = React.Children.toArray(children);
  const visibleAvatars = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-[12px]',
    md: 'w-10 h-10 text-[14px]',
    lg: 'w-12 h-12 text-[16px]',
  };

  return (
    <div className={`inline-flex items-center -space-x-2 overflow-hidden ${className}`} {...props}>
      {visibleAvatars.map((child, idx) => (
        <div key={idx} className="ring-2 ring-white rounded-full">
          {child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={`inline-flex items-center justify-center rounded-full bg-[#f3f4f6] text-[#4b5563] font-semibold ring-2 ring-white select-none ${sizeStyles[size]}`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
