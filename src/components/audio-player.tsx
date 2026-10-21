"use client";

import { useEffect, useRef, useState } from "react";
import {
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { LANGUAGE_LABEL, LANGUAGE_ORDER } from "@/lib/constants";
import { formatDuration } from "@/lib/format";
import type { Language } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

export interface PlayerTrack {
  id: string;
  language: Language;
  title: string;
  audioUrl: string;
  duration: number;
  voice?: string | null;
}

export function AudioPlayer({
  tracks,
  className,
}: {
  tracks: PlayerTrack[];
  className?: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [language, setLanguage] = useState<Language>("ES");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [rate, setRate] = useState(1);

  const available = tracks.filter((t) => LANGUAGE_ORDER.includes(t.language));
  const track = available.find((t) => t.language === language) ?? available[0];

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setPlaying(false);
    setCurrent(0);
    setDuration(track?.duration ?? 0);
  }, [track?.id, track?.duration]);

  if (!track) {
    return (
      <p className="text-sm text-[var(--field-soft)]">
        Este punto todavía no tiene audioguía cargada.
      </p>
    );
  }

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  function seek(delta: number) {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = Math.max(0, Math.min(el.duration || 0, el.currentTime + delta));
  }

  function cycleRate() {
    const next = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : rate === 1.5 ? 0.75 : 1;
    setRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className={cn("plate p-4", className)}>
      <audio
        ref={audioRef}
        src={track.audioUrl}
        preload="metadata"
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => {
          const d = e.currentTarget.duration;
          if (Number.isFinite(d) && d > 0) setDuration(d);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="display text-[1.35rem] leading-tight text-[var(--color-ink)]">
            {track.title}
          </p>
          <p className="measure mt-1 text-[0.72rem] text-[var(--field-soft)]">
            {formatDuration(duration || track.duration)}
          </p>
        </div>

        {available.length > 1 && (
          <div
            className="flex border border-[var(--rule-strong)]"
            role="group"
            aria-label="Idioma de la audioguía"
          >
            {available.map((t) => (
              <button
                key={t.language}
                type="button"
                onClick={() => setLanguage(t.language)}
                aria-pressed={t.language === track.language}
                className={cn(
                  "label px-2.5 py-1.5 transition-colors duration-150",
                  t.language === track.language
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                    : "text-[var(--field-soft)] hover:text-[var(--color-ink)]",
                )}
              >
                {LANGUAGE_LABEL[t.language]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        className="relative mt-4 h-1.5 w-full track"
        role="slider"
        aria-label="Progreso de la reproducción"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(current)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") seek(5);
          if (e.key === "ArrowLeft") seek(-5);
        }}
      >
        <div
          className="absolute inset-y-0 left-0 bg-[var(--color-rust)] transition-[width] duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 flex items-center gap-1">
        <button
          type="button"
          onClick={() => seek(-10)}
          className="p-2.5 text-[var(--field-soft)] transition-colors duration-150 hover:text-[var(--color-ink)]"
          aria-label="Retroceder 10 segundos"
        >
          <RotateCcw className="size-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={toggle}
          className="grid size-11 place-items-center bg-[var(--color-ink)] text-[var(--color-paper)] transition-colors duration-150 hover:bg-[var(--color-rust)] active:scale-95"
          aria-label={playing ? "Pausar" : "Reproducir la audioguía"}
        >
          {playing ? (
            <Pause className="size-5" aria-hidden="true" />
          ) : (
            <Play className="size-5" aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          onClick={() => seek(10)}
          className="p-2.5 text-[var(--field-soft)] transition-colors duration-150 hover:text-[var(--color-ink)]"
          aria-label="Avanzar 10 segundos"
        >
          <RotateCw className="size-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={cycleRate}
          className="measure ml-1 px-2 py-1.5 text-[0.72rem] text-[var(--field-soft)] transition-colors duration-150 hover:text-[var(--color-ink)]"
          aria-label={`Velocidad de reproducción: ${rate} veces`}
        >
          {rate.toString().replace(".", ",")}×
        </button>

        <button
          type="button"
          onClick={() => {
            const el = audioRef.current;
            if (!el) return;
            el.muted = !el.muted;
            setMuted(el.muted);
          }}
          className="ml-auto p-2.5 text-[var(--field-soft)] transition-colors duration-150 hover:text-[var(--color-ink)]"
          aria-label={muted ? "Activar el sonido" : "Silenciar"}
        >
          {muted ? (
            <VolumeX className="size-4" aria-hidden="true" />
          ) : (
            <Volume2 className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {track.voice === "tts" && (
        <p className="measure mt-3 text-[0.68rem] text-[var(--field-soft)]">
          Voz sintética de demostración · se reemplaza por la grabación del guía
        </p>
      )}
    </div>
  );
}
