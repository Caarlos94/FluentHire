import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt =
  "FluentHire — AI-powered English interview practice for developers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), "public/logo-icon-dark.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  const scores = [
    { label: "Communication", value: 88, color: "#60a5fa" },
    { label: "Technical", value: 85, color: "#a78bfa" },
    { label: "Problem Solving", value: 92, color: "#34d399" },
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "60px 70px",
          background: "linear-gradient(135deg, #0a0a1a 0%, #1a1040 50%, #0d1530 100%)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-50px",
            left: "200px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Left: branding + text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            maxWidth: "580px",
            gap: "24px",
          }}
        >
          {/* Logo + brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img src={logoSrc} width={52} height={52} />
            <span style={{ fontSize: 32, fontWeight: 700, color: "#ffffff" }}>
              Fluent
            </span>
            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "transparent",
                backgroundImage: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                backgroundClip: "text",
                marginLeft: -8,
              }}
            >
              Hire
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <span style={{ fontSize: 46, fontWeight: 700, color: "#ffffff", lineHeight: 1.15 }}>
              Ace Your Next
            </span>
            <span
              style={{
                fontSize: 46,
                fontWeight: 700,
                lineHeight: 1.15,
                color: "transparent",
                backgroundImage: "linear-gradient(135deg, #6366f1, #a78bfa)",
                backgroundClip: "text",
              }}
            >
              Coding Interview
            </span>
            <span style={{ fontSize: 46, fontWeight: 700, color: "rgba(255,255,255,0.5)", lineHeight: 1.15 }}>
              in English
            </span>
          </div>

          {/* Tagline */}
          <span style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
            AI-powered practice with real-time feedback on communication clarity and technical depth.
          </span>
        </div>

        {/* Right: score card mockup */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "36px 40px",
            width: "420px",
          }}
        >
          {/* Card header */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(52,211,153,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                color: "#34d399",
              }}
            >
              ✓
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#ffffff" }}>
              Interview Complete
            </span>
          </div>

          {/* Scores row */}
          <div style={{ display: "flex", gap: "28px", marginTop: "8px" }}>
            {scores.map((score) => (
              <div
                key={score.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                {/* Score circle */}
                <div
                  style={{
                    width: 88,
                    height: 88,
                    borderRadius: "50%",
                    border: `3px solid ${score.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: `rgba(${score.color === "#60a5fa" ? "96,165,250" : score.color === "#a78bfa" ? "167,139,250" : "52,211,153"},0.08)`,
                  }}
                >
                  <span
                    style={{
                      fontSize: 32,
                      fontWeight: 700,
                      color: score.color,
                    }}
                  >
                    {score.value}
                  </span>
                </div>
                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>
                  {score.label}
                </span>
              </div>
            ))}
          </div>

          {/* Focus tip */}
          <div
            style={{
              display: "flex",
              width: "100%",
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "10px",
              padding: "12px 16px",
              marginTop: "4px",
              gap: "8px",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: 13, color: "#a78bfa", fontWeight: 600 }}>
              Focus tip:
            </span>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
              Structure answers with the STAR method
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
