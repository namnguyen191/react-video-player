import React, { useState } from 'react';
import styles from './App.module.scss';

function App() {
  const [videoSrc, setVideoSrc] = useState<string | undefined>();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList = e.target.files!;

    for (const [key, value] of Object.entries(files)) {
      console.log(`${key}: ${value.type}`);
    }

    const fileURL = URL.createObjectURL(files[0]);

    setVideoSrc(() => fileURL);
  };

  return (
    <div className={styles.PlayerContainer}>
      <div className={styles.InputContainer}>
        <input type="file" accept="video/*" multiple onChange={onInputChange} />
      </div>
      <div className={styles.VideosList}>
        <h2>Play List</h2>
      </div>
      <div className={styles.VideoFrame}>
        <video controls autoPlay src={videoSrc}></video>
      </div>
    </div>
  );
}

export default App;
