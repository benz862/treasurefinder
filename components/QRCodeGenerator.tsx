"use client";

import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";

interface QRCodeGeneratorProps {
  url: string;
  eventTitle: string;
}

export function QRCodeGenerator({ url, eventTitle }: QRCodeGeneratorProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  function downloadPNG() {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const svgData = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const urlBlob = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx?.drawImage(img, 0, 0, 512, 512);
      URL.revokeObjectURL(urlBlob);
      const link = document.createElement("a");
      link.download = `${eventTitle.replace(/\s+/g, "-").toLowerCase()}-qr.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = urlBlob;
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-teal-100 bg-white p-6">
      <div ref={qrRef} className="rounded-xl bg-white p-4">
        <QRCodeSVG value={url} size={160} level="M" />
      </div>
      <p className="text-center text-xs text-charcoal/60 break-all">{url}</p>
      <button
        type="button"
        onClick={downloadPNG}
        className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2 text-sm font-medium text-white hover:bg-teal/90"
      >
        <Download className="h-4 w-4" />
        Download QR Code
      </button>
    </div>
  );
}
