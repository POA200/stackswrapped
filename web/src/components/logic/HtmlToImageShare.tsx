"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { RefObject, useState } from "react";
import { toPng } from "html-to-image";

interface HtmlToImageShareProps {
  targetRef: RefObject<HTMLElement>;
  fileName: string;
}

export function HtmlToImageShare({
  targetRef,
  fileName,
}: HtmlToImageShareProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!targetRef.current) return;
    setIsSaving(true);
    try {
      const dataUrl = await toPng(targetRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
        skipAutoScale: false,
      });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to save image", err);
      alert("Failed to save image. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSave}
      disabled={isSaving}
      className="gap-2"
    >
      <Download className="w-4 h-4" />
    </Button>
  );
}
