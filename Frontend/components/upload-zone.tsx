"use client";

import React, { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Upload, FileAudio, FileVideo, X, CheckCircle2 } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClearFile: () => void;
  disabled?: boolean;
}

const SUPPORTED_EXTENSIONS = ["mp4", "mp3", "wav", "m4a", "webm", "mkv", "aac", "ogg"];

export function UploadZone({
  onFileSelect,
  selectedFile,
  onClearFile,
  disabled = false,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (ext && SUPPORTED_EXTENSIONS.includes(ext)) {
        onFileSelect(file);
      } else {
        alert(`Unsupported file format. Please upload: ${SUPPORTED_EXTENSIONS.join(", ")}`);
      }
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (selectedFile) {
    const isVideo = selectedFile.type.startsWith("video");
    return (
      <div className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 flex items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-800/40 flex items-center justify-center shrink-0 text-indigo-600 dark:text-indigo-400">
            {isVideo ? <FileVideo className="w-5 h-5" /> : <FileAudio className="w-5 h-5" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
              <span>{formatFileSize(selectedFile.size)}</span>
              <span>•</span>
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Ready for analysis
              </span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearFile}
          disabled={disabled}
          title="Remove selected file"
          aria-label="Remove selected file"
          className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      className={`group relative w-full rounded-xl border border-dashed p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
        isDragging
          ? "border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 scale-[0.99]"
          : "border-zinc-300 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/20 hover:border-zinc-400 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900/40"
      } ${disabled ? "pointer-events-none opacity-50" : ""}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*,audio/*,.mp4,.mp3,.wav,.m4a,.webm,.mkv,.aac,.ogg"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      <div className="w-11 h-11 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:scale-105 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-all mb-3 shadow-xs">
        <Upload className="w-5 h-5" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
          <span className="text-indigo-600 dark:text-indigo-400 group-hover:underline">
            Click to browse
          </span>{" "}
          or drag and drop video / audio
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          MP4, MP3, WAV, M4A, WEBM, MKV (local file processed via Whisper)
        </p>
      </div>
    </div>
  );
}
