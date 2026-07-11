import { ImageResponse } from "next/og";
import {
  LOGO_GRADIENT_CSS,
  LOGO_MARK_LABEL,
} from "@/components/brand/logoMark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 40,
          background: LOGO_GRADIENT_CSS,
          color: "white",
          fontSize: 72,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {LOGO_MARK_LABEL}
      </div>
    ),
    { ...size },
  );
}
