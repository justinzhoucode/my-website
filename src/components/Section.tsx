import type { ComponentPropsWithoutRef } from 'react';

// Consistent vertical rhythm + scroll anchor for each block of content.
export default function Section({
  className = '',
  children,
  ...rest
}: ComponentPropsWithoutRef<'section'>) {
  return (
    <section className={`py-24 ${className}`} {...rest}>
      {children}
    </section>
  );
}
