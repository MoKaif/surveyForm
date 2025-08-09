import React from "react";

function Toast({ message, type = "info", onClose }) {
  if (!message) return null;
  return (
    <div className={`toast toast-${type}`}>
      {message}
      <button onClick={onClose} style={{ marginLeft: 12 }}>
        ✖
      </button>
      <style>{`
        .toast {
          position: fixed;
          top: 1rem;
          right: 1rem;
          background: #fff;
          color: #333;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          padding: 0.75rem 1.5rem;
          z-index: 1000;
          display: flex;
          align-items: center;
          font-size: 1rem;
        }
        .toast-info { border-left: 4px solid #3498db; }
        .toast-success { border-left: 4px solid #27ae60; }
        .toast-error { border-left: 4px solid #e74c3c; }
        .toast button {
          background: none;
          border: none;
          color: #888;
          font-size: 1.1rem;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

export default Toast;
