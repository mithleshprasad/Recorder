

import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container, Button } from "react-bootstrap";
import { withReactContent } from "sweetalert2";
import Swal from "sweetalert2";

const ScreenRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const videoRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const mediaRecorder = new MediaRecorder(stream);
      setStream(stream);
      setMediaRecorder(mediaRecorder);

      const chunks = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      };

      mediaRecorder.start();
      setRecording(true);
      Swal.fire({
        icon: "success",
        title: "Recording Started",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Error accessing screen:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to access the screen!",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setMediaRecorder(null);
      setRecording(false);
      Swal.fire({
        icon: "success",
        title: "Recording Stopped",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const downloadVideo = () => {
    if (videoUrl) {
      const a = document.createElement("a");
      a.href = videoUrl;
      a.download = "recorded_video.webm";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(videoUrl);
      Swal.fire({
        icon: "success",
        title: "Start Downloading!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      // Stop recording
      stopRecording();
    } else {
      Swal.fire({
        icon: "error",
        title: "No recorded video available",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#">Recorder</Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="mt-5" style={{ height: "100vh" }}>
        <div className="text-center mb-4">
          <h1> Recorder</h1>
          <p>Click the button below to start recording .</p>
        </div>
        <Button
          onClick={recording ? stopRecording : startRecording}
          variant={recording ? "danger" : "primary"}
          className="mx-auto d-block mb-4"
        >
          {recording ? "Stop Recording" : "Start Recording"}
        </Button>
        <Button
          onClick={downloadVideo}
          disabled={!videoUrl}
          variant="success"
          className="mx-auto d-block"
        >
          Download Video
        </Button>
        <div className="mt-5">
          {stream && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="mx-auto d-block"
              style={{ maxWidth: "100%" }}
            />
          )}
        </div>
      </Container>
      <footer className="footer mt-auto py-3 bg-dark text-white text-center">
        <div className="container">
          <span>
            Screen Recorder App &copy; {new Date().getFullYear()} - Created by
            Mithlesh Maurya
          </span>
        </div>
      </footer>
    </div>
  );
};

export default ScreenRecorder;
