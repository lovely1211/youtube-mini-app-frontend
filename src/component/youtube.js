import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/auth/user`, { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const login = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const logout = () => {
    axios.get(`${API_BASE_URL}/auth/logout`, { withCredentials: true })
      .then(() => setUser(null));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

const VideoPage = () => {
  const [video, setVideo] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [comment, setComment] = useState("");
  const { user, login } = useAuth();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/video/your_video_id`).then((res) => setVideo(res.data));
  }, []);

  const updateTitle = () => {
    axios.put(`${API_BASE_URL}/video/${video.videoId}`, { title: newTitle })
      .then((res) => setVideo(res.data));
  };

  const addComment = () => {
    axios.post(`${API_BASE_URL}/comment`, { videoId: video.videoId, text: comment, author: user.name })
      .then(() => setComment(""));
  };

  if (!video) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{video.title}</h1>
      <p>Video ID: {video.videoId}</p>
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${video.videoId}`}
        title="YouTube video"
        allowFullScreen
      ></iframe>
      {user ? (
        <div>
          <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="New title" />
          <button onClick={updateTitle} className="ml-2 bg-blue-500 text-white px-2 py-1">Update Title</button>
          <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add comment" />
          <button onClick={addComment} className="ml-2 bg-green-500 text-white px-2 py-1">Add Comment</button>
        </div>
      ) : (
        <button onClick={login} className="bg-red-500 text-white px-2 py-1">Login with Google</button>
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <nav className="p-4 bg-gray-800 text-white">
          <Link to="/">Home</Link>
        </nav>
        <Routes>
          <Route path="/" element={<VideoPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
