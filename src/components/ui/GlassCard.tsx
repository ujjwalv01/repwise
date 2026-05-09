'use client';
import { motion } from 'framer-motion';
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  glow?: 'accent' | 'success' | 'danger' | 'none';
  tilt?: boolean;
  padding?: string;
  level?: 1 | 2; // border elevation level
}

export function GlassCard({
  children,
  className = '',
  style,
  onClick,
  glow = 'none',
  tilt = false,
  padding = '20px 24px',
  level = 1,
}: GlassCardProps) {
  const borderColor = level === 2
    ? 'var(--border-default)'
    : 'var(--border-subtle)';

  const glowStyle = glow === 'accent' 
    ? '0 0 40px -10px rgba(0,212,255,0.15)' 
    : glow === 'success'
    ? '0 0 40px -10px rgba(57,255,20,0.1)'
    : glow === 'danger'
    ? '0 0 40px -10px rgba(255,77,109,0.1)'
    : 'none';

  return (
    <motion.div
      className={`glass ${className}`}
      style={{
        padding,
        border: `1px solid ${borderColor}`,
        boxShadow: glowStyle,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onClick={onClick}
      whileHover={tilt ? { rotateX: 1, rotateY: -1, scale: 1.005 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      {children}
    </motion.div>
  );
}
