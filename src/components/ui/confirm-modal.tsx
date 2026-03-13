"use client";

import { Button } from "~/components/ui/button";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isProcessing?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  isProcessing = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{description}</p>

        <div className="mt-5 flex items-center justify-end gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            {cancelText}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "Deleting..." : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
