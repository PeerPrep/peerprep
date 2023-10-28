import { useEffect, useRef } from "react";

type Callback = () => void;

const useAccurateInterval = (callback: Callback, delay: number | null) => {
  const savedCallback = useRef<Callback | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      return;
    }

    if (!workerRef.current) {
      workerRef.current = new Worker("/utils/webworker.js");
      workerRef.current.onmessage = () => {
        if (savedCallback.current) {
          savedCallback.current();
        }
      };
    }

    workerRef.current.postMessage({ delay, id: 1 });

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [delay]);
};

export default useAccurateInterval;
