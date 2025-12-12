"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toPng } from "html-to-image";
import React from "react";

interface HtmlToImageDownloadProps {
  targetRef: React.RefObject<HTMLElement>;
  fileName?: string; // optional custom filename
}

export function HtmlToImageDownload({
  targetRef,
  fileName,
}: HtmlToImageDownloadProps) {
  const [downloading, setDownloading] = React.useState(false);

  const handleDownload = async () => {
    if (!targetRef?.current) return;
    try {
      setDownloading(true);
      const dataUrl = await toPng(targetRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        skipFonts: false,
        // You can tweak filter if needed to exclude animated stickers
      });
      const link = document.createElement("a");
      const name = fileName || "StacksWrapped_Card.png";
      link.download = name;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("PNG download failed:", err);
      alert("Sorry, failed to generate image. Try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={downloading}
      className="text-xs"
    >
      <Download className="w-4 h-4 mr-1" />
    </Button>
  );
}
