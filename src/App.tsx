import { useState, useRef, useEffect } from "react";
import html2canvas from "html2canvas";
import { Rnd } from "react-rnd";

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [frame, setFrame] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [selected, setSelected] = useState(false);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 150, height: 150 });

  const previewRef = useRef<HTMLDivElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);

  const startAngleRef = useRef(0);
  const startRotationRef = useRef(0);

  // Handle click outside to deselect
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        selected &&
        imgWrapperRef.current &&
        !imgWrapperRef.current.contains(e.target as Node)
      ) {
        setSelected(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [selected]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedUrl = URL.createObjectURL(e.target.files[0]);
      setImage(uploadedUrl);
      setPosition({ x: 0, y: 0 });
      setSize({ width: 150, height: 150 });
      setRotation(0);
    }
  };

  const handleDownload = async () => {
    if (previewRef.current) {
      const canvas = await html2canvas(previewRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#1e1e1e",
      });
      const link = document.createElement("a");
      link.download = "dp-blast.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  const startRotate = (e: React.PointerEvent) => {
    e.preventDefault();
    if (!imgWrapperRef.current) return;

    const rect = imgWrapperRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clientX = e.clientX;
    const clientY = e.clientY;

    startAngleRef.current = Math.atan2(clientY - centerY, clientX - centerX) * (180 / Math.PI);
    startRotationRef.current = rotation;

    const moveHandler = (moveEvent: PointerEvent) => {
      const moveX = moveEvent.clientX;
      const moveY = moveEvent.clientY;
      const currentAngle = Math.atan2(moveY - centerY, moveX - centerX) * (180 / Math.PI);
      const delta = currentAngle - startAngleRef.current;
      setRotation(startRotationRef.current + delta);
    };

    const stopHandler = () => {
      document.removeEventListener("pointermove", moveHandler);
      document.removeEventListener("pointerup", stopHandler);
    };

    document.addEventListener("pointermove", moveHandler);
    document.addEventListener("pointerup", stopHandler);
  };


  useEffect(() => {
    const step = 5;
    const handleKey = (e: KeyboardEvent) => {
      setPosition((prev) => {
        switch (e.key) {
          case "ArrowUp":
            return { ...prev, y: prev.y - step };
          case "ArrowDown":
            return { ...prev, y: prev.y + step };
          case "ArrowLeft":
            return { ...prev, x: prev.x - step };
          case "ArrowRight":
            return { ...prev, x: prev.x + step };
          default:
            return prev;
        }
      });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
      <div
      style={{
        width: "100vw",
        // height: "100vh",
        // backgroundColor: "#1e1e1e",
        color: "#f5f5f5",
        display: "flex",
        justifyContent: "center", // horizontal center
        alignItems: "center",     // vertical center
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
       style={{
          width: "80%",        // responsive width
          maxWidth: "400px",   // limit maximum width
          aspectRatio: "1",    // maintain square shape
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo + Name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 20,
            // marginBottom: 20,
          }}
        >
          <img
            src="sits-logo.png"
            alt="SITS Logo"
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <span
            style={{
              fontSize: "1.3rem",
              color: "#f5f5f5",
              fontWeight: "bold",
            }}
          >
            Society of Information Technology Students
          </span>
        </div>

        <h1
          style={{
            marginBottom: "20px",
            fontSize: "1.8rem",
            textAlign: "center",
          }}
        >
          Get Your Profile Now
        </h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{
            marginBottom: "20px",
            padding: "10px",
            borderRadius: "6px",
            border: "1px solid #555",
            backgroundColor: "#2c2c2c",
            color: "#f5f5f5",
            cursor: "pointer",
            width: "100%",
          }}
        />

        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "10px",
            width: "100%",
          }}
        >
          <button
            onClick={() => setFrame("/frames/frame1.png")}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #555",
              backgroundColor: "#2c2c2c",
              color: "#f5f5f5",
              cursor: "pointer",
              flex: "1 1 45%",
            }}
          >
            Frame 1
          </button>
          <button
            onClick={() => setFrame("/frames/frame2.png")}
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #555",
              backgroundColor: "#2c2c2c",
              color: "#f5f5f5",
              cursor: "pointer",
              flex: "1 1 45%",
            }}
          >
            Frame 2
          </button>
        </div>

        <div
          ref={previewRef}
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "1",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #555",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
            backgroundColor: "#2c2c2c",
          }}
        >
          {image && (
            <Rnd
              size={size}
              position={position}
              bounds="parent"
              lockAspectRatio
              onDragStop={(_e, d) => setPosition({ x: d.x, y: d.y })}
              onResizeStop={(_e, _direction, ref, _delta, newPos) => {
                const img = imgWrapperRef.current?.querySelector("img");
                if (img) {
                  const naturalRatio = img.naturalWidth / img.naturalHeight;
                  const newWidth = ref.offsetWidth;
                  setSize({ width: newWidth, height: newWidth / naturalRatio });
                  setPosition(newPos);
                }
              }}
              onDoubleClick={() => setSelected(true)}
              onTouchStart={() => setSelected(true)} // <-- Add this for mobile tap
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
                  border: selected ? "1px dashed #f5f5f5" : "none",
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
                      onPointerDown={startRotate}
                      style={{
                        position: "absolute",
                        top: "-25px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 24,
                        height: 24,
                        background: "#444",
                        border: "1px solid #f5f5f5",
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

        {image && frame && (
          <button
            onClick={handleDownload}
            style={{
              padding: "12px",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#007bff",
              color: "#fff",
              width: "100%",
            }}
          >
            ⬇️ Download
          </button>
        )}
        {/* Footer */}
        <div
          style={{
            width: "100%",
            padding: "10px 15px",
            // backgroundColor: "#1b1b1b",
            color: "#f5f5f5",
            textAlign: "center",
            fontSize: "0.9rem",
            borderTop: "1px solid #444",
            position: "relative",
            marginTop: 20,
            borderRadius: 6,
          }}
        >
          <div>
            Developed by <strong>Gerald Magda</strong> | VP Internal
          </div>
          <div>Access Computer College Manila Campus</div>
          <div>© 2025 DP Blast Web App</div>
        </div>

      </div>
      
    </div>
    
  );
}

export default App;
