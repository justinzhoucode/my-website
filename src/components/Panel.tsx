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
      className={`rounded-2xl border border-line bg-white/85 p-5 sm:p-8 backdrop-blur-md shadow-[0_1px_2px_rgba(26,26,24,0.04),0_16px_40px_-16px_rgba(26,26,24,0.14)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
