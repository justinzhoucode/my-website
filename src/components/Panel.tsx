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
      className={`rounded-2xl border border-line bg-black/30 p-8 backdrop-blur-md ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
