import { ImageResponse } from "next/og";
import {
  LOGO_GRADIENT_CSS,
  LOGO_MARK_LABEL,
} from "@/components/brand/logoMark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          background: LOGO_GRADIENT_CSS,
          color: "white",
          fontSize: 13,
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
