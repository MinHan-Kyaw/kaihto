import { type ReactNode, useEffect, useId, useRef, useState } from 'react';

interface DotsMenuProps {
  label: string;
  children: ReactNode;
}

// A three-dot button that opens a panel; a click outside or Escape closes it.
const DotsMenu = ({ label, children }: DotsMenuProps) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="grid size-11 cursor-pointer place-items-center rounded-full text-ink-muted hover:bg-brand-light hover:text-brand"
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        ref={buttonRef}
        onClick={() => setOpen(!open)}
      >
        <svg className="size-5" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <circle cx="10" cy="4" r="1.75" fill="currentColor" />
          <circle cx="10" cy="10" r="1.75" fill="currentColor" />
          <circle cx="10" cy="16" r="1.75" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <div
          id={panelId}
          className="absolute top-full right-0 z-20 mt-1 flex w-56 flex-col rounded-2xl border-2 border-line bg-surface p-1 shadow-edge"
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default DotsMenu;
