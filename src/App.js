import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://youtube-mini-app-backend.onrender.com";
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/auth/user`, { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);

  const login = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const logout = () => {
    axios.get(`${API_BASE_URL}/auth/logout`, { withCredentials: true }).then(() => setUser(null));
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
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
    axios.put(`${API_BASE_URL}/video/${video.videoId}`, { title: newTitle }).then((res) => setVideo(res.data));
  };

  const addComment = () => {
    axios.post(`${API_BASE_URL}/comment`, { videoId: video.videoId, text: comment, author: user.name }).then(() => setComment(""));
  };

  if (!video) return <div className="text-center text-lg font-semibold mt-10">Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{video.title}</h1>
      <p className="text-gray-600 mb-4">Video ID: {video.videoId}</p>
      <div className="mb-4">
        <iframe
          className="w-full rounded-lg"
          height="315"
          src={`https://www.youtube.com/embed/${video.videoId}`}
          title="YouTube video"
          allowFullScreen
        ></iframe>
      </div>
      {user ? (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              className="border border-gray-300 p-2 rounded w-full"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="New title"
            />
            <button onClick={updateTitle} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Update
            </button>
          </div>
          <div className="flex space-x-2">
            <input
              className="border border-gray-300 p-2 rounded w-full"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
            />
            <button onClick={addComment} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              Comment
            </button>
          </div>
        </div>
      ) : (
        <button onClick={login} className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-4">
          Login with Google
        </button>
      )}
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <nav className="p-4 bg-gray-800 text-white flex justify-between">
          <Link to="/" className="text-lg font-semibold">Home</Link>
        </nav>
        <Routes>
          <Route path="/" element={<VideoPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
