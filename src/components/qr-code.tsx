"use client";

import { useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";

export function QrCode({
  value,
  size = 168,
  className,
}: {
  value: string;
  size?: number;
  className?: string;
}) {
  const level = useMemo(() => (value.length > 60 ? "L" : "M"), [value.length]);
  return (
    <QRCodeSVG
      value={value}
      size={size}
      level={level}
      marginSize={0}
      bgColor="transparent"
      fgColor="#0F3246"
      className={className}
      title={`Código QR de señalética: ${value}`}
    />
  );
}
