import React from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  wide?: boolean;
};

export default function Modal({ open, onClose, title, children, wide }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className={`bg-[#232323] rounded-lg shadow-xl p-6 min-w-[330px] ${wide ? "max-w-lg" : "max-w-sm"}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-base text-gray-300 hover:text-white font-mono">×</button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
}
