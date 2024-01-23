import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";

const Camera = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  const captureImage = () => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (videoElement && canvasElement) {
      const context = canvasElement.getContext("2d");
      if (context) {
        const { videoWidth, videoHeight } = videoElement;
        canvasElement.width = videoWidth;
        canvasElement.height = videoHeight;
        context.drawImage(videoElement, 0, 0, videoWidth, videoHeight);

        const imageDataUrl = canvasElement.toDataURL("image/png");
        setCapturedImages((prevImages) => [...prevImages, imageDataUrl]);
      }
    }
  };

  useEffect(() => {
    async function enableStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing the camera", err);
      }
    }

    if (!stream) {
      enableStream();
    } else {
      return function cleanup() {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      };
    }
  }, [stream]);

  return (
    <div>
      <div>
        <video ref={videoRef} autoPlay playsInline />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
      <Button label="Capture" onClick={captureImage} />
      <div>
        {capturedImages.map((image, index) => (
          <img key={index} src={image} alt={`Captured ${index}`} />
        ))}
      </div>
    </div>
  );
};

export default Camera;
