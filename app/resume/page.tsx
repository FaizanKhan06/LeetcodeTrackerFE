"use client";

import { useRef, useEffect, useState } from "react";
import {
  Download,
  BookIcon,
  SaveAllIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Editor } from "@monaco-editor/react";
import parse from "html-react-parser";

export default function ResumePage() {
  const resumeRef = useRef<HTMLDivElement>(null);
  const resumeContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Stores editor content
  const [markup, setMarkup] = useState<string>(`
    <div class="text-center">
      <h1 class="text-3xl font-bold">John Doe</h1>
      <h2 class="text-lg text-gray-600">Software Engineer</h2>
    </div>

    <hr class="my-4 border-2 border-gray-400 w-1/2 mx-auto" />

    <h2 class="text-xl font-semibold mt-4">Skills</h2>
    <ul class="list-disc list-inside text-sm">
      <li>JavaScript / TypeScript</li>
      <li>React / Next.js</li>
      <li>Node.js / Express</li>
    </ul>
  `);

  // Stores parsed markup for preview
  const [compiledMarkup, setCompiledMarkup] = useState(markup);

  useEffect(() => {
    function handleResize() {
      if (!resumeRef.current) return;
      const containerWidth = resumeRef.current.offsetWidth;
      const pageWidth = 756;
      const newScale = containerWidth / pageWidth;
      setScale(newScale);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCompile = () => {
    try {
      parse(markup); // test parse
      setCompiledMarkup(markup); // update preview only if valid
    } catch (err) {
      alert("Error in HTML: " + err);
    }
  };

  const handleExport = () => {
  if (!compiledMarkup) return;

  const printWindow = window.open("", "_blank", "width=800,height=600");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Resume</title>
        <style>
          @page { size: A4; margin: 0; }
          body { 
            margin: 0; 
            padding: 0; 
            width: 210mm; 
            height: 297mm; 
            overflow: hidden; 
            font-family: sans-serif; 
          }
          #resume-container {
            width: 100%; 
            height: 100%; 
            transform-origin: top left;
          }
        </style>
      </head>
      <body>
        <div id="resume-container">
          ${compiledMarkup}
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};



  return (
    <div className="flex flex-col md:flex-row justify-center bg-background gap-4 p-4">
      {/* Left panel - Editor */}
      <Card className="w-full max-w-md p-4 gap-4">
        <CardHeader className="p-0 flex items-center justify-between">
          <CardTitle className="text-2xl">Resume HTML</CardTitle>
          <Button className="w-auto" onClick={handleCompile}>
            <SaveAllIcon /> Compile
          </Button>
          <Button className="w-auto">
            <BookIcon /> Templates
          </Button>
        </CardHeader>
        <CardContent className="h-full min-h-[500px] space-y-6 px-0 rounded-lg overflow-hidden">
          <Editor
            defaultLanguage="html"
            value={markup}
            onChange={(val) => setMarkup(val || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 12,
              lineNumbers: "off",
            }}
          />
        </CardContent>
      </Card>

      {/* Right panel - Preview */}
      <Card className="w-full max-w-md p-4 gap-4">
        <CardHeader className="p-0 flex items-center justify-between">
          <CardTitle className="text-2xl">Preview</CardTitle>
          <Button className="w-auto" onClick={handleExport}>
            <Download /> Export
          </Button>
        </CardHeader>

        {/* Editable Preview */}
        <div
          ref={resumeRef}
          className="aspect-[210/297] w-full bg-white rounded-lg relative overflow-hidden overflow-y-auto preview-scroll"
        >
          <div
            style={{
              width: `${756 * scale}px`,
              height: `${1069 * scale}px`,
            }}
          >
            <div
              ref={resumeContainerRef}
              style={{
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                width: "756px",
              }}
              className="text-black outline-none"
            >
              {parse(compiledMarkup)}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
