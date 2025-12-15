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
      // Clone the node
      const node = targetRef.current;
      const clone = node.cloneNode(true) as HTMLElement;
      // Set fixed width, let height grow, and fix font size/scaling
      const fixedWidth = 440;
      clone.style.width = fixedWidth + "px";
      clone.style.minWidth = fixedWidth + "px";
      clone.style.maxWidth = fixedWidth + "px";
      clone.style.fontSize = "16px";
      clone.style.lineHeight = "1.25";
      clone.style.boxSizing = "border-box";
      clone.style.background = "white";
      // Prevent scaling by device pixel ratio
      clone.style.transform = "none";
      // Wrap in a container to avoid layout issues
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-99999px";
      container.style.top = "0";
      container.style.zIndex = "-1";
      container.style.background = "white";
      container.appendChild(clone);
      document.body.appendChild(container);
      // Hide share, download, disconnect buttons in header
      const headerActions = clone.querySelectorAll(
        ".card-header-actions, .card-header-share, .card-header-download, .card-header-disconnect"
      );
      headerActions.forEach(
        (el) => ((el as HTMLElement).style.display = "none")
      );

      // Hide navigation buttons and story/progress segments in footer
      const navFooter = clone.querySelectorAll(
        ".card-footer-nav, .card-footer-progress, .card-footer, .card-progress, .card-navigation, .card-nav"
      );
      navFooter.forEach((el) => ((el as HTMLElement).style.display = "none"));

      // Also hide any Button with aria-label for share/download/disconnect if present
      const ariaButtons = clone.querySelectorAll(
        'button[aria-label="Share"],button[aria-label="Download"],button[aria-label="Disconnect"]'
      );
      ariaButtons.forEach((el) => ((el as HTMLElement).style.display = "none"));

      // Wait for fonts/images to load if needed (optional, can be improved)
      await new Promise((resolve) => setTimeout(resolve, 100));
      // Use html-to-image on the clone
      const dataUrl = await toPng(clone, {
        cacheBust: true,
        pixelRatio: 5,
        skipFonts: false,
        backgroundColor: "white",
      });
      document.body.removeChild(container);
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
