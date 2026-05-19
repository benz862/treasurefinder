"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-teal px-6 py-3 font-medium text-white"
    >
      Print Flyer
    </button>
  );
}
