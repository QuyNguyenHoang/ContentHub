import { useEffect, useState } from "react";

interface ToastProps {
  showToast: boolean;
  message: string;
  alertColor:string;
  onClose: () => void;
}

export default function Toast({
  showToast,
  message,
  alertColor,
  onClose,
}: ToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!showToast) return;

    setProgress(100);

    let value = 100;

    const interval = setInterval(() => {
      value -= 2;

      setProgress(value);

      if (value <= 0) {
        clearInterval(interval);
        onClose();
      }
    }, 60);

    return () => clearInterval(interval);
  }, [showToast, onClose]);

  if (!showToast) return null;

  return (
    <div
      className="toast show"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        minWidth: 300,
        zIndex: 9999,
      }}
    >
      <div className={`toast-header bg-${alertColor} text-white`}>
        <strong className="me-auto">Notification</strong>

        <button
          type="button"
          className="btn-close btn-close-white"
          onClick={onClose}
        />
      </div>

      <div className="toast-body">
        {message}

        <div className="progress mt-2" style={{ height: 4 }}>
          <div
           className={`progress-bar bg-${alertColor}`}
            style={{
              width: `${progress}%`,
              transition: "width 0.06s linear",
            }}
          />
        </div>
      </div>
    </div>
  );
}