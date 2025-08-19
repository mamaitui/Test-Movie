import React, { useState, useEffect } from 'react';
import Player from './Player';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [videoFiles, setVideoFiles] = useState([]);
  const [currentVideoFile, setCurrentVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const SERVER_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:5000'
    : process.env.REACT_APP_SERVER_URL;


  
  // โหลดรายชื่อเรื่อง
  useEffect(() => {
    fetch(`${SERVER_URL}/videos`)
      .then(res => res.json())
      .then(setMovies)
      .catch(console.error);
  }, [SERVER_URL]);

  // โหลดตอนของเรื่องที่เลือก
  useEffect(() => {
    if (selectedMovie) {
      fetch(`${SERVER_URL}/videos/${encodeURIComponent(selectedMovie)}`)
        .then(res => res.json())
        .then(setVideoFiles)
        .catch(console.error);
    }
  }, [selectedMovie, SERVER_URL]);

  const goHome = () => {
    setSelectedMovie(null);
    setVideoFiles([]);
    setCurrentVideoFile(null);
    setVideoUrl(null);
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setCurrentVideoFile(null);
    setVideoUrl(null);
  };

  const handleVideoSelect = (videoFile) => {
    setCurrentVideoFile(videoFile);
    setVideoUrl(
      `${SERVER_URL}/video/${encodeURIComponent(selectedMovie)}/${encodeURIComponent(videoFile)}`
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="logo" onClick={goHome}>MyFlix</h1>
        {selectedMovie && !videoUrl && (
          <button className="back-btn" onClick={goHome}>← Back</button>
        )}
      </header>

      {/* Player */}
      {videoUrl && (
        <div className="player-section">
          <Player option={{ url: videoUrl, title: currentVideoFile }} />
        </div>
      )}

      {/* หน้าแรก */}
      {!selectedMovie && (
        <div className="movie-list">
          {movies.map(movie => (
            <div
              className="movie-card"
              key={movie}
              onClick={() => handleMovieSelect(movie)}
            >
              <div
                className="thumb"
                style={{
                  backgroundImage: `url(${SERVER_URL}/cover/${encodeURIComponent(movie)}), linear-gradient(135deg,#333,#555)`,
                }}
              ></div>
              <h3>{movie}</h3>
            </div>
          ))}
        </div>
      )}

      {/* หน้ารายการตอน */}
      {selectedMovie && !videoUrl && (
        <div className="episode-list-vertical">
          {videoFiles.map((file, idx) => (
            <div
              key={file}
              className="episode-item"
              onClick={() => handleVideoSelect(file)}
            >
              <div
                className="episode-thumb"
                style={{
                  backgroundImage: `url(${SERVER_URL}/thumb/${encodeURIComponent(selectedMovie)}/${encodeURIComponent(file)}), linear-gradient(135deg,#444,#666)`,
                }}
              ></div>
              <div className="episode-info">
                <h4>{`EP${idx + 1} - ${file}`}</h4>
                <p>ความยาว: --:--</p> {/* TODO: สามารถดึง duration จาก backend ได้ */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
