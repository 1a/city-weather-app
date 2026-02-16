"use client";

export default function DeleteConfirmation({
  cityName,
  onConfirm,
  onCancel,
}: {
  cityName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="rounded-xl bg-white p-6 shadow-xl max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold mb-2">Delete City</h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete <strong>{cityName}</strong>? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
