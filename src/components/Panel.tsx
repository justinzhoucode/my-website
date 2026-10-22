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
      className={`rounded-2xl border border-line bg-card/85 p-5 sm:p-8 backdrop-blur-md shadow-[var(--panel-shadow)] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
