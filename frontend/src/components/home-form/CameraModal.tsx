import { useState, useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

interface CameraModalProps {
    onClose: () => void;
    onCapture: (file: File, url: string) => void;
    mode: boolean;
}

const CameraModal = ({ onClose, onCapture, mode }: CameraModalProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [cameraStatus, setCameraStatus] = useState<string>("Initializing...");
    const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const countdownRef = useRef<number | null>(null);
    const isAutoCapturingRef = useRef<boolean>(false);
    const [isPoseValid, setIsPoseValid] = useState(false);

    useEffect(() => {
        // Load Model on Mount
        const loadModel = async () => {
            await tf.ready();
            const model = poseDetection.SupportedModels.MoveNet;
            const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING };
            detectorRef.current = await poseDetection.createDetector(model, detectorConfig);
        };
        loadModel();

        startCamera();

        return () => {
            stopCamera();
        }
    }, []);

    const startCamera = async () => {
        setCameraStatus("Starting camera...");
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadeddata = () => {
                    setCameraStatus("Loading AI Model...");
                    detectPose();
                };
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Could not access camera. Please ensure you have allowed camera permissions.");
            onClose();
        }
    };

    const stopCamera = () => {
        if (stream) {
            // Note: we can't easily access the current stream state inside the cleanup if it's changing, 
            // but typically for this modal lifecycle we stop what we started.
            // Actually, we should probably use a ref for stream or just rely on the fact that we'll stop the tracks we created.
            // For now, let's just stop the tracks on the local variable if available or rely on the ref approach if we had one.
            // However, since `stream` is state, we might miss it in cleanup if not careful.
            // Better to check the video srcObject.
        }
        // Safer way to stop in cleanup:
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
            tracks.forEach(track => track.stop());
        }

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        isAutoCapturingRef.current = false;
    };

    const detectPose = async () => {
        if (!videoRef.current || !detectorRef.current || isAutoCapturingRef.current) return;

        try {
            const poses = await detectorRef.current.estimatePoses(videoRef.current);

            if (poses.length > 0) {
                const keypoints = poses[0].keypoints;

                const nose = keypoints.find(kp => kp.name === 'nose');
                const leftAnkle = keypoints.find(kp => kp.name === 'left_ankle');
                const rightAnkle = keypoints.find(kp => kp.name === 'right_ankle');

                const confidenceThreshold = 0.3;

                const isFullBodyVisible =
                    (nose && nose.score && nose.score > confidenceThreshold) &&
                    (leftAnkle && leftAnkle.score && leftAnkle.score > confidenceThreshold) &&
                    (rightAnkle && rightAnkle.score && rightAnkle.score > confidenceThreshold);

                console.log('Pose:', { noseScore: nose?.score, leftAnkleScore: leftAnkle?.score, rightAnkleScore: rightAnkle?.score, isFullBodyVisible });

                if (isFullBodyVisible) {
                    setIsPoseValid(true);
                    if (!countdownRef.current) {
                        setCameraStatus("Hold steady...");
                        countdownRef.current = Date.now();
                    } else {
                        const elapsed = Date.now() - countdownRef.current;
                        const timeLeft = Math.max(0, 3 - Math.floor(elapsed / 1000));
                        setCameraStatus(`Hold steady... ${timeLeft}`);

                        if (timeLeft === 0) {
                            isAutoCapturingRef.current = true;
                            capturePhoto();
                            return;
                        }
                    }
                } else {
                    setIsPoseValid(false);
                    countdownRef.current = null;

                    if ((!leftAnkle || leftAnkle.score! < confidenceThreshold) || (!rightAnkle || rightAnkle.score! < confidenceThreshold)) {
                        setCameraStatus("Go back to show your feet.");
                    } else if (!nose || nose.score! < confidenceThreshold) {
                        setCameraStatus("Show your face clearly.");
                    } else {
                        setCameraStatus("Position full body in frame.");
                    }
                }
            } else {
                setIsPoseValid(false);
                setCameraStatus("No person detected.");
                countdownRef.current = null;
            }

        } catch (error) {
            console.error("Detection error:", error);
        }

        animationFrameRef.current = requestAnimationFrame(detectPose);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;

                // Mirror the image to match the preview
                context.translate(videoRef.current.videoWidth, 0);
                context.scale(-1, 1);

                context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);

                canvasRef.current.toBlob((blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        const file = new File([blob], "camera-capture.png", { type: "image/png" });
                        stopCamera();
                        onCapture(file, url);
                        onClose();
                    }
                }, 'image/png');
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
            <div className={`relative w-full max-w-lg p-4 rounded-2xl ${!mode ? 'bg-white' : 'dMB'}`}>
                <h3 className={`text-xl font-bold mb-4 text-center ${!mode ? 'text-black' : 'text-white'}`}>Auto-Capture</h3>
                <div className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden mb-4 border-4 transition-colors duration-300 ${isPoseValid ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]'}`}>
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]"></video>
                    <div className="absolute inset-x-0 bottom-4 text-center">
                        <span className="bg-black bg-opacity-50 text-white px-4 py-2 rounded-full font-semibold">
                            {cameraStatus}
                        </span>
                    </div>
                </div>
                <canvas ref={canvasRef} className="hidden"></canvas>

                <div className="flex justify-between gap-4">
                    <button onClick={onClose} className="flex-1 py-2 rounded-xl border border-gray-300 font-semibold hover:bg-gray-100 transition-colors text-gray-700">Cancel</button>
                    <button onClick={capturePhoto} className="flex-1 py-2 rounded-xl rangeColor text-white font-semibold hover:opacity-90 transition-opacity">Manual Capture</button>
                </div>
            </div>
        </div>
    );
};

export default CameraModal;
