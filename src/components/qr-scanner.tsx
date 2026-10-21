"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { Camera, Keyboard, Loader2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type ScannerState = "idle" | "requesting" | "scanning" | "denied" | "unsupported" | "found";

export function QrScanner({
  onDetected,
}: {
  onDetected: (raw: string) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  const [state, setState] = useState<ScannerState>("idle");
  const [manual, setManual] = useState("");
  const [error, setError] = useState("");

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState("unsupported");
      setError("Este navegador no permite usar la cámara desde la web.");
      return;
    }
    setState("requesting");
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas) return;
      video.srcObject = stream;
      await video.play();
      setState("scanning");
      doneRef.current = false;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const tick = () => {
        if (doneRef.current) return;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          const image = ctx?.getImageData(0, 0, canvas.width, canvas.height);
          if (image) {
            const code = jsQR(image.data, image.width, image.height, {
              inversionAttempts: "dontInvert",
            });
            if (code?.data) {
              doneRef.current = true;
              stop();
              setState("found");
              onDetected(code.data);
              return;
            }
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (err) {
      stop();
      setState("denied");
      setError(
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "No diste permiso para usar la cámara. Podés escribir el código a mano."
          : "No se pudo abrir la cámara. Podés escribir el código a mano.",
      );
    }
  }, [onDetected, stop]);

  return (
    <div className="grid items-start gap-8 lg:grid-cols-2">
      <div>
        <div className="relative aspect-square overflow-hidden border-2 border-[var(--color-ink)] bg-[var(--color-ink)]">
          <video
            ref={videoRef}
            playsInline
            muted
            className={cn(
              "h-full w-full object-cover",
              state !== "scanning" && state !== "requesting" && "opacity-0",
            )}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Marco de lectura */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="relative size-56 sm:size-72">
              <span className="absolute left-0 top-0 h-1 w-10 bg-[var(--color-rust)]" />
              <span className="absolute right-0 top-0 h-1 w-10 bg-[var(--color-rust)]" />
              <span className="absolute bottom-0 left-0 h-1 w-10 bg-[var(--color-rust)]" />
              <span className="absolute bottom-0 right-0 h-1 w-10 bg-[var(--color-rust)]" />
              {state === "scanning" && (
                <span className="absolute inset-x-0 top-1/2 h-0.5 bg-[var(--color-turq)]" />
              )}
            </div>
          </div>

          {state === "idle" || state === "denied" || state === "unsupported" || state === "found" ? (
            <div className="absolute inset-0 grid place-items-center px-8 text-center">
              <div>
                {state === "denied" || state === "unsupported" ? (
                  <TriangleAlert className="mx-auto size-8 text-[var(--color-sunset)]" aria-hidden="true" />
                ) : (
                  <Camera className="mx-auto size-8 text-[var(--color-paper)]/70" aria-hidden="true" />
                )}
                <p className="mt-4 text-[1rem] leading-relaxed text-[var(--color-paper)]/85">
                  {state === "idle" &&
                    "Apuntá la cámara al código de la señalética del sendero."}
                  {state === "found" && "Código leído."}
                  {(state === "denied" || state === "unsupported") && error}
                </p>
              </div>
            </div>
          ) : null}

          {state === "requesting" && (
            <div className="absolute inset-0 grid place-items-center">
              <Loader2 className="size-8 animate-spin text-[var(--color-paper)]" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {state !== "scanning" && state !== "requesting" && (
            <button type="button" onClick={start} className="btn btn-primary">
              <Camera className="size-4" aria-hidden="true" />
              Activar la cámara
            </button>
          )}
          {state === "scanning" && (
            <button type="button" onClick={() => { stop(); setState("idle"); }} className="btn btn-ghost">
              Apagar la cámara
            </button>
          )}
        </div>
      </div>

      <div className="plate p-6">
        <p className="display text-[1.5rem] text-[var(--field)]">
          También podés escribir el código
        </p>
        <p className="mt-2 text-[0.875rem] leading-relaxed text-[var(--field-soft)]">
          Si el cartel está gastado, si no tenés permisos de cámara o si estás en
          el navegador de escritorio, escribí el código que aparece en la
          señalética.
        </p>
        <form
          className="mt-5"
          onSubmit={(e) => {
            e.preventDefault();
            const value = manual.trim();
            if (value) onDetected(value);
          }}
        >
          <label htmlFor="codigo" className="label text-[var(--field-soft)]">
            Código del punto
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="codigo"
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="ECOF-003"
              autoComplete="off"
              className="field measure"
            />
            <button type="submit" className="btn btn-ink shrink-0">
              <Keyboard className="size-4" aria-hidden="true" />
              Buscar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
