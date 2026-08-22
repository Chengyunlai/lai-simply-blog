import { ImageResponse } from "next/og";
import { baseURL, person } from "@/resources";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Lai Simply Blog";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          fontFamily: "system-ui",
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#e5e5e5",
            marginBottom: 20,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#a0a0a0",
          }}
        >
          A blog powered by Lai Simply Blog
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
