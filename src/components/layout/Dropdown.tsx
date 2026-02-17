import { useEffect, useRef } from "react";

type Item = { id: string; label: string; icon?: string; onClick?: () => void };

export function Dropdown({
  open,
  onClose,
  items,
}: {
  open: boolean;
  onClose: () => void;
  items: Item[];
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return;
      const el = ref.current;
      if (el && !el.contains(e.target as Node)) onClose();
    }
    function onEsc(e: KeyboardEvent) {
      if (open && e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div ref={ref} className="dropdownMenu" role="menu">
      {items.map((it) => (
        <button
          key={it.id}
          className="dropdownItem"
          onClick={() => {
            it.onClick?.();
            onClose();
          }}
          role="menuitem"
        >
          <span aria-hidden="true">{it.icon ?? "↗"}</span>
          {it.label}
        </button>
      ))}
    </div>
  );
}
