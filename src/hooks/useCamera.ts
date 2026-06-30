import { useState, useEffect, useCallback } from 'react';

export type CameraPermissionStatus = 'prompt' | 'granted' | 'denied' | 'unavailable';

interface UseCameraReturn {
  stream: MediaStream | null;
  error: Error | null;
  permissionStatus: CameraPermissionStatus;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export function useCamera(): UseCameraReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<CameraPermissionStatus>('prompt');

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
      setStream(null);
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError(new Error('MediaDevices API not supported on this browser'));
      setPermissionStatus('unavailable');
      return;
    }

    try {
      // First try to get the environment (rear) camera
      const constraints: MediaStreamConstraints = {
        video: true
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setPermissionStatus('granted');
      setError(null);
    } catch (err: any) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setPermissionStatus('denied');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        // Fallback for devices without cameras
        setPermissionStatus('unavailable');
      }
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // We can't access `stream` directly in the cleanup without adding it to the deps array,
      // but adding it causes re-renders. So we use the stopCamera callback which is stable.
      // But wait, the callback uses `stream` from closure. We'll track the latest stream in a ref
      // or just re-run cleanup when stream changes.
    };
  }, []);

  // Proper cleanup
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    stream,
    error,
    permissionStatus,
    startCamera,
    stopCamera
  };
}
