import { useState } from "react";
import { Rnd } from "react-rnd";

interface DPBlastUIProps {
  image: string | null;
  frame: string | null;
  rotation: number;
  selected: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  previewRef: React.RefObject<HTMLDivElement | null>;
  imgWrapperRef: React.RefObject<HTMLDivElement | null>;
  setFrame: (frame: string | null) => void;
  setSelected: (val: boolean) => void;
  setPosition: (pos: { x: number; y: number }) => void;
  setSize: (size: { width: number; height: number }) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDownload: () => void;
  startRotate: (e: React.MouseEvent) => void;
}

export default function DPBlastUI({
  image,
  frame,
  rotation,
  selected,
  position,
  size,
  previewRef,
  imgWrapperRef,
  setFrame,
  setSelected,
  setPosition,
  setSize,
  handleImageUpload,
  handleDownload,
  startRotate,
}: DPBlastUIProps) {
  const [ignoreClick, setIgnoreClick] = useState(false);

  return (
    <div
      style={{
        fontFamily: "Helvetica, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        background: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <img
          src="/logo.png"
          alt="Logo"
          style={{ width: 50, height: 50, objectFit: "contain" }}
        />
        <h2 style={{ fontWeight: 400, fontSize: "20px" }}>My Organization</h2>
      </header>

      <h1 style={{ fontWeight: "bold", fontSize: "28px", marginBottom: "20px" }}>
        🎉 DP Blast 🎉
      </h1>

      {/* Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{
          marginBottom: "20px",
          padding: "6px 12px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          cursor: "pointer",
        }}
      />

      {/* Frame selection */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={() => setFrame("/frames/frame1.png")}
          style={{
            padding: "8px 16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Frame 1
        </button>
        <button
          onClick={() => setFrame("/frames/frame2.png")}
          style={{
            padding: "8px 16px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          Frame 2
        </button>
      </div>

      {/* DP Preview Card */}
      <div
        ref={previewRef}
        onClick={(e) => {
          if (
            !ignoreClick &&
            imgWrapperRef.current &&
            !imgWrapperRef.current.contains(e.target as Node)
          ) {
            setSelected(false); // deselect only when clicking outside
          }
        }}
        style={{
          position: "relative",
          width: "320px",
          height: "320px",
          marginBottom: "20px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {image && (
          <Rnd
            size={size}
            position={position}
            bounds="parent"
            lockAspectRatio
            onDragStart={() => setIgnoreClick(true)}
            onDragStop={(_e, d) => {
              setIgnoreClick(false);
              setPosition({ x: d.x, y: d.y });
            }}
            onResizeStart={() => setIgnoreClick(true)}
            onResizeStop={(_e, _dir, ref, _delta, newPos) => {
              setIgnoreClick(false);
              const img = imgWrapperRef.current?.querySelector("img");
              if (img) {
                const naturalRatio = img.naturalWidth / img.naturalHeight;
                const newWidth = ref.offsetWidth;
                setSize({ width: newWidth, height: newWidth / naturalRatio });
                setPosition(newPos);
              }
            }}
            onDoubleClick={() => setSelected(!selected)}
          >
            <div
              ref={imgWrapperRef}
              style={{
                width: "100%",
                height: "100%",
                transform: `rotate(${rotation}deg)`,
                transformOrigin: "center center",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: selected ? "2px dashed #333" : "none",
                zIndex: 2,
              }}
            >
              <img
                src={image}
                alt="Uploaded"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                  pointerEvents: "none",
                }}
              />
              {selected && (
                <div
                  onMouseDown={startRotate}
                  style={{
                    position: "absolute",
                    top: "-25px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 24,
                    height: 24,
                    background: "#fff",
                    border: "1px solid #333",
                    borderRadius: "50%",
                    cursor: "grab",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: "bold",
                    zIndex: 3,
                  }}
                >
                  🔄
                </div>
              )}
            </div>
          </Rnd>
        )}

        {frame && (
          <img
            src={frame}
            alt="Frame"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
              zIndex: 1,
              opacity: selected ? 0.3 : 1,
            }}
          />
        )}
      </div>

      {/* Download Button */}
      {image && frame && (
        <button
          onClick={handleDownload}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "none",
            background: "#007bff",
            color: "#fff",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          ⬇️ Download DP
        </button>
      )}
    </div>
  );
}
