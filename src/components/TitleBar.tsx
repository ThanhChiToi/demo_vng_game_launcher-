import React from 'react';

// Khai báo Type cho TypeScript hiểu window.electronAPI
declare global {
  interface Window {
    electronAPI?: {
      minimize: () => void;
      close: () => void;
    };
  }
}

export const TitleBar: React.FC = () => {
  const handleMinimize = () => {
    window.electronAPI?.minimize();
  };

  const handleClose = () => {
    window.electronAPI?.close();
  };

  return (
    <div style={styles.titleBar}>
      <div style={styles.dragArea}>
        <span style={styles.appTitle}>VNGGames Launcher</span>
      </div>

      <div style={styles.windowControls}>
        <button onClick={handleMinimize} style={styles.controlBtn}>━</button>
        <button onClick={handleClose} style={{ ...styles.controlBtn, ...styles.closeBtn }}>✕</button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  titleBar: {
    height: '32px',
    backgroundColor: '#1a1a1a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    userSelect: 'none',
  },
  dragArea: {
    flex: 1,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '12px',
    WebkitAppRegion: 'drag', // Cho phép kéo thả cửa sổ
  } as React.CSSProperties,
  windowControls: {
    display: 'flex',
    height: '100%',
    WebkitAppRegion: 'no-drag', // Bắt buộc để bấm được nút
  } as React.CSSProperties,
  controlBtn: {
    width: '46px',
    height: '100%',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ccc',
    cursor: 'pointer',
    fontSize: '11px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    fontSize: '13px',
  },
};