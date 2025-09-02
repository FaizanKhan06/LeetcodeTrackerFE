"use client";

import { useEffect, useState } from "react";

export default function ResumePreviewPage() {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    // Get HTML from sessionStorage
    const stored = sessionStorage.getItem("resume_html");
    if (stored) setHtml(stored);
  }, []);

  // Trigger print when HTML is set
  useEffect(() => {
    if (html) {
      // Wait a tick to ensure DOM is painted before printing
      setTimeout(() => {
        window.print();
      }, 300);
    }
  }, [html]);

  if (!html) return <p>Loading...</p>;

  return (
    <>
      <style jsx global>{`
        main {
          margin: 0 !important;
          padding: 0 !important;
          background: white;
        }
        @page {
          size: A4;
          margin: 0;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      `}</style>

      <div
        className="w-screen h-screen bg-white text-black"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
