"use client";

import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

type Facing = "environment" | "user";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [enabled, setEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [facing, setFacing] = useState<Facing>("environment");
  const [decoded, setDecoded] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const ua = navigator.userAgent || "";
    const uaDataMobile =
      (navigator as Navigator & { userAgentData?: { mobile?: boolean } })
        .userAgentData?.mobile === true;
    setIsMobile(
      /Android|iPhone|iPad|iPod|IEMobile|Mobile|Opera Mini/i.test(ua) ||
        uaDataMobile
    );

    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stop() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    const v = videoRef.current;
    if (v) v.srcObject = null;
    setEnabled(false);
  }

  function scanLoop() {
    const v = videoRef.current;
    const c = canvasRef.current;
    if (!v || !c || v.readyState < 2) {
      rafRef.current = requestAnimationFrame(scanLoop);
      return;
    }
    c.width = v.videoWidth || 640;
    c.height = v.videoHeight || 480;
    const ctx = c.getContext("2d");
    if (!ctx) {
      rafRef.current = requestAnimationFrame(scanLoop);
      return;
    }
    ctx.drawImage(v, 0, 0, c.width, c.height);
    const img = ctx.getImageData(0, 0, c.width, c.height);
    const code = jsQR(img.data, img.width, img.height, {
      inversionAttempts: "attemptBoth",
    });
    if (code && code.data) {
      setDecoded(code.data);
      stop(); // stop after first hit
      return;
    }
    rafRef.current = requestAnimationFrame(scanLoop);
  }

  async function start(targetFacing?: Facing) {
    try {
      setError("");
      setDecoded(null);
      setEnabled(true); // ✅ render the video first

      // wait one paint so React mounts <video>
      await new Promise<void>((r) => requestAnimationFrame(() => r()));

      const v = videoRef.current;
      if (!v) {
        setError("Video element not mounted");
        setEnabled(false);
        return;
      }

      const isSecure =
        location.protocol === "https:" ||
        ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
      if (!isSecure) {
        setError("Camera requires HTTPS or localhost/127.0.0.1.");
        setEnabled(false);
        return;
      }

      const face = isMobile ? targetFacing ?? facing : undefined;
      const constraints: MediaStreamConstraints = face
        ? { video: { facingMode: { ideal: face } }, audio: false }
        : { video: true, audio: false };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // ✅ set attributes in JSX; just wire stream + play here
      v.srcObject = stream;
      await v.play().catch(() => {});
      scanLoop();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to start camera");
      stop();
    }
  }

  async function handleEnable() {
    await start("environment"); // prefer back on mobile; desktop ignores
  }

  async function handleSwitch() {
    if (!isMobile) return;
    const next: Facing = facing === "environment" ? "user" : "environment";
    setFacing(next);
    stop();
    await start(next);
  }

  async function handleRescan() {
    setDecoded(null);
    await start(facing);
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl space-y-4">
        <h1 className="text-xl font-semibold">Camera (QR Scanner)</h1>

        {!enabled && !decoded && (
          <div className="rounded border bg-white p-4">
            <p className="text-sm mb-3">
              We need access to your camera to scan the QR and extract its text.
            </p>
            <button
              onClick={handleEnable}
              className="rounded bg-black text-white px-4 py-2 text-sm"
            >
              Enable camera &amp; Start scan
            </button>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <p className="mt-2 text-xs text-gray-500">
              Use HTTPS or localhost/127.0.0.1 and allow permission.
            </p>
          </div>
        )}

        {/* ✅ video is ALWAYS mounted; we just hide the block when disabled */}
        <div className={`space-y-3 ${enabled ? "block" : "hidden"}`}>
          <div className="relative rounded border bg-black inline-block overflow-hidden">
            <video
              ref={videoRef}
              className="w-full max-w-lg h-80 object-contain"
              muted
              playsInline
              autoPlay
            />
            <div className="scanline pointer-events-none" />
            <div className="mask pointer-events-none" />
          </div>
          <div className="flex gap-2">
            {isMobile && (
              <button
                onClick={handleSwitch}
                className="rounded border px-4 py-2 text-sm"
              >
                Switch camera
              </button>
            )}
            <button onClick={stop} className="rounded border px-4 py-2 text-sm">
              Stop
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {decoded && !enabled && (
          <div className="rounded border bg-white p-4 space-y-3">
            <div className="text-sm text-gray-600">Decoded text:</div>
            <pre className="text-sm whitespace-pre-wrap break-all text-black">
              {decoded}
            </pre>
            <div className="flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(decoded)}
                className="rounded border px-3 py-2 text-sm"
              >
                Copy
              </button>
              <button
                onClick={handleRescan}
                className="rounded bg-black text-white px-3 py-2 text-sm"
              >
                Scan again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* hidden canvas for decoding */}
      <canvas ref={canvasRef} className="hidden" />

      <style jsx>{`
        .scanline {
          position: absolute;
          left: 0;
          right: 0;
          height: 2px;
          background: rgba(255, 0, 0, 0.9);
          box-shadow: 0 0 12px rgba(255, 0, 0, 0.6),
            0 0 2px rgba(255, 0, 0, 1) inset;
          animation: scan-vert 2.2s linear infinite;
        }
        @keyframes scan-vert {
          0% {
            top: 0%;
          }
          95% {
            top: calc(100% - 2px);
          }
          100% {
            top: calc(100% - 2px);
          }
        }
        .mask {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.35) 0%,
            rgba(0, 0, 0, 0) 15%,
            rgba(0, 0, 0, 0) 85%,
            rgba(0, 0, 0, 0.35) 100%
          );
        }
      `}</style>
    </div>
  );
}
