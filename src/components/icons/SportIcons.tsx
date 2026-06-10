import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const LogoIcon: React.FC<IconProps> = ({ className = '', size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 8h24M4 16h24M4 24h24M8 4v24M16 4v24M24 4v24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const MlbIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M7 14c1-2 1.5-4 0-8M13 14c-1-2-1.5-4 0-8" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M10 2v2M10 16v2" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export const NbaIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M2 10h16M10 2c-3 3-3 13 0 16M10 2c3 3 3 13 0 16" stroke="currentColor" strokeWidth="1" fill="none" />
    <path d="M3.5 5.5c2.5 1.5 10.5 1.5 13 0M3.5 14.5c2.5-1.5 10.5-1.5 13 0" stroke="currentColor" strokeWidth="0.75" fill="none" />
  </svg>
);

export const NflIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="10" cy="10" rx="8" ry="6" stroke="currentColor" strokeWidth="1.5" fill="none" transform="rotate(-15 10 10)" />
    <path d="M6.5 6.5l.5 7M10 5.5l.5 9M13.5 6.5l.5 7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" transform="rotate(-15 10 10)" />
    <path d="M15.5 8c1.5.5 2.5 1.5 2.5 2.5s-1 2-2.5 2.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
  </svg>
);

export const NhlIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 14l4-10M6 4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <ellipse cx="13" cy="13" rx="3.5" ry="2" stroke="currentColor" strokeWidth="1.5" fill="none" transform="rotate(-10 13 13)" />
    <path d="M9 13.5l3-1" stroke="currentColor" strokeWidth="1" />
  </svg>
);

export const SoccerIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M10 2l2 4.5 4.5 1.5-3.5 3 1 4.5L10 13.5l-4 2 1-4.5L3.5 8 8 6.5z" stroke="currentColor" strokeWidth="1" fill="none" />
    <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="0.75" fill="none" />
  </svg>
);

export const TennisIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="8" cy="12" rx="5" ry="6" stroke="currentColor" strokeWidth="1.5" fill="none" transform="rotate(-30 8 12)" />
    <path d="M11.5 6.5l4-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="16.5" cy="1.5" r="1.5" fill="currentColor" />
  </svg>
);

export const TeamLogoPlaceholder: React.FC<{ teamName: string; className?: string; size?: number }> = ({
  teamName,
  className = '',
  size = 20,
}) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="20" height="20" rx="4" fill="#CBD5E1" />
    <text x="10" y="14" textAnchor="middle" fill="#475569" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">
      {teamName.charAt(0)}
    </text>
  </svg>
);
