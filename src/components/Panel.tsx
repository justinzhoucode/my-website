import type { ComponentPropsWithoutRef } from 'react';

// A calm, semi-transparent surface that keeps dense text readable while the
// background still shows through.
export default function Panel({
  className = '',
  children,
  ...rest
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={`rounded-2xl border border-white/20 bg-black/40 p-8 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_0_60px_-12px_rgba(255,255,255,0.12),0_30px_80px_-24px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.18)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
