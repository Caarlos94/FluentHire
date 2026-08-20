"use client";

import { useTheme } from "next-themes";
import Editor, { type OnMount } from "@monaco-editor/react";
import { Loader2 } from "lucide-react";
import { useRef, useCallback } from "react";
import { LANGUAGES } from "./code-editor-utils";

export { getDefaultLanguage, getLanguageLabel, getLanguageTemplate, LANGUAGES } from "./code-editor-utils";

export function CodeEditor({
  value,
  onChange,
  language,
  onLanguageChange,
  minHeight = "300px",
  placeholder,
  toolbarRight,
  fillHeight = false,
}: {
  value: string;
  onChange: (value: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  minHeight?: string;
  placeholder?: string;
  toolbarRight?: React.ReactNode;
  fillHeight?: boolean;
}) {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  const handleMount: OnMount = useCallback((editor) => {
    editorRef.current = editor;
    editor.focus();
  }, []);

  return (
    <div className={fillHeight ? "flex flex-col h-full gap-2" : "space-y-2"}>
      {/* Language selector + toolbar */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-muted-foreground">
            Language:
          </label>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value} className="bg-background text-foreground">
                {lang.label}
              </option>
            ))}
          </select>
        </div>
        {toolbarRight}
      </div>

      {/* Editor */}
      <div
        className={`overflow-hidden rounded-lg border border-input ${fillHeight ? "flex-1" : ""}`}
        style={fillHeight ? undefined : { minHeight }}
      >
        <Editor
          height={fillHeight ? "100%" : minHeight}
          language={language}
          value={value}
          onChange={(v) => onChange(v ?? "")}
          onMount={handleMount}
          theme={resolvedTheme === "dark" ? "vs-dark" : "vs"}
          loading={
            <div className="flex items-center justify-center gap-2 py-12">
              <Loader2 className="size-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                Loading editor...
              </span>
            </div>
          }
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: "on",
            padding: { top: 12, bottom: 12 },
            renderLineHighlight: "none",
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
            placeholder,
          }}
        />
      </div>
    </div>
  );
}
