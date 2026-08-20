"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { WordTimestamp } from "@/types/api";

interface KaraokeTextProps {
  text: string;
  timestamps: WordTimestamp[];
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
}

/**
 * Normalize a word for fuzzy matching: lowercase, strip punctuation.
 */
function normalize(w: string): string {
  return w.toLowerCase().replace(/[^a-z0-9']/g, "");
}

/**
 * Build a mapping from text word index → timestamp index.
 * Uses fuzzy matching to handle punctuation and hyphenation differences
 * between the original text and Whisper's transcription.
 */
function buildWordMap(
  textWords: string[],
  timestamps: WordTimestamp[]
): Map<number, number> {
  const map = new Map<number, number>();
  let tsIdx = 0;

  for (let i = 0; i < textWords.length; i++) {
    if (tsIdx >= timestamps.length) break;

    const textNorm = normalize(textWords[i]);
    if (!textNorm) continue; // skip empty after normalization

    const tsNorm = normalize(timestamps[tsIdx].word);

    if (textNorm === tsNorm) {
      // Exact match
      map.set(i, tsIdx);
      tsIdx++;
    } else if (tsNorm.startsWith(textNorm) || textNorm.startsWith(tsNorm)) {
      // Partial match (e.g., "trade-offs" vs "trade")
      map.set(i, tsIdx);
      // If the timestamp word is shorter, advance timestamp to consume fragments
      if (textNorm.startsWith(tsNorm)) {
        let consumed = tsNorm;
        while (
          consumed.length < textNorm.length &&
          tsIdx + 1 < timestamps.length
        ) {
          tsIdx++;
          consumed += normalize(timestamps[tsIdx].word);
        }
      }
      tsIdx++;
    } else {
      // No match — skip this timestamp and try again
      map.set(i, tsIdx);
      tsIdx++;
    }
  }

  return map;
}

export function KaraokeText({
  text,
  timestamps,
  audioRef,
  isPlaying,
}: KaraokeTextProps) {
  const [activeTsIdx, setActiveTsIdx] = useState(-1);
  const activeWordRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number>(0);

  // Split text into words and whitespace segments
  const segments = useMemo(() => text.split(/(\s+)/), [text]);
  const wordIndices = useMemo(() => {
    const indices: number[] = [];
    segments.forEach((seg, i) => {
      if (!/^\s+$/.test(seg)) indices.push(i);
    });
    return indices;
  }, [segments]);

  // Build the word-to-timestamp mapping once
  const wordMap = useMemo(() => {
    const textWords = wordIndices.map((i) => segments[i]);
    return buildWordMap(textWords, timestamps);
  }, [segments, wordIndices, timestamps]);

  // Reverse map: timestamp index → text word indices
  const tsToWords = useMemo(() => {
    const reverse = new Map<number, number[]>();
    wordMap.forEach((tsIdx, wordIdx) => {
      const existing = reverse.get(tsIdx) || [];
      existing.push(wordIdx);
      reverse.set(tsIdx, existing);
    });
    return reverse;
  }, [wordMap]);

  useEffect(() => {
    if (!isPlaying || !audioRef.current) {
      if (!isPlaying) setActiveTsIdx(-1);
      return;
    }

    const audio = audioRef.current;

    const tick = () => {
      const t = audio.currentTime;
      let idx = -1;

      for (let i = 0; i < timestamps.length; i++) {
        if (t >= timestamps[i].start && t < timestamps[i].end) {
          idx = i;
          break;
        }
        // Handle gaps between words — highlight the next word slightly early
        if (
          i > 0 &&
          t >= timestamps[i - 1].end &&
          t < timestamps[i].start
        ) {
          idx = i;
          break;
        }
      }

      setActiveTsIdx(idx);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isPlaying, timestamps, audioRef]);

  // Auto-scroll to keep the active word visible
  useEffect(() => {
    if (activeWordRef.current && containerRef.current) {
      const word = activeWordRef.current;
      const container = containerRef.current;
      const wordTop = word.offsetTop - container.offsetTop;
      const wordBottom = wordTop + word.offsetHeight;
      const scrollTop = container.scrollTop;
      const visibleBottom = scrollTop + container.clientHeight;

      if (wordBottom > visibleBottom - 20 || wordTop < scrollTop + 20) {
        container.scrollTo({
          top: wordTop - container.clientHeight / 3,
          behavior: "smooth",
        });
      }
    }
  }, [activeTsIdx]);

  // Determine which text word indices are active
  const activeTextWords = activeTsIdx >= 0 ? (tsToWords.get(activeTsIdx) || []) : [];

  let wordIdx = 0;

  return (
    <div
      ref={containerRef}
      className="max-h-64 overflow-y-auto rounded-lg bg-primary/5 p-4 text-sm leading-loose"
    >
      {segments.map((segment, i) => {
        // Whitespace — render as-is
        if (/^\s+$/.test(segment)) {
          return <span key={i}>{segment}</span>;
        }

        const currentWordIdx = wordIdx;
        wordIdx++;
        const mappedTs = wordMap.get(currentWordIdx) ?? -1;
        const isActive = activeTextWords.includes(currentWordIdx);
        const isPast = activeTsIdx >= 0 && mappedTs >= 0 && mappedTs < activeTsIdx;

        return (
          <span
            key={i}
            ref={isActive ? activeWordRef : null}
            className={`inline rounded-sm px-0.5 transition-colors duration-150 ${
              isActive
                ? "bg-primary/20 text-primary font-medium"
                : isPast
                  ? "text-foreground"
                  : isPlaying
                    ? "text-muted-foreground/60"
                    : "text-foreground"
            }`}
          >
            {segment}
          </span>
        );
      })}
    </div>
  );
}
