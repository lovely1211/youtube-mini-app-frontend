import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "https://youtube-mini-app-backend.onrender.com";

// const API_BASE_URL = "http://localhost:5000/api";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/auth/callback`, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  const logout = () => {
    axios.get(`${API_BASE_URL}/logout`, { withCredentials: true }).then(() => setUser(null));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// Authentication Page 
const AuthPage = () => {
  const { login, loading, user } = useAuth();

  if (!loading && user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 max-w-md mx-auto bg-white shadow-lg rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4 ">Login to Continue</h2>
        <button onClick={login} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
          Login with Google
        </button>
      </div>
    </div>
  );
};

// Video Page 
const VideoPage = () => {
  const [video, setVideo] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [comment, setComment] = useState("");
  const { user, login, loading } = useAuth();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/videos/12345`).then((res) => setVideo(res.data));
  }, []);

  const updateTitle = () => {
    axios.put(`${API_BASE_URL}/videos/${video.videoId}`, { title: newTitle }).then((res) => setVideo(res.data));
  };

  const addComment = () => {
    axios.post(`${API_BASE_URL}/comments`, { videoId: video.videoId, text: comment, author: user.name }).then(() => setComment(""));
  };

  if (loading) return <div className="text-center text-lg font-semibold mt-10">Loading...</div>;

  if (!user) return <Navigate to="/auth" />; 

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{video?.title || "Video Title"}</h1>
      <div className="mb-4">
        <iframe
          className="w-full rounded-lg"
          height="315"
          src={`https://www.youtube.com/embed/12345`}
          title="YouTube video"
          allowFullScreen
        ></iframe>
      </div>
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
    </div>
  );
};

// App Component
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <nav className="p-4 bg-gray-800 text-white flex justify-between">
          <Link to="/" className="text-lg font-semibold">Home</Link>
        </nav>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<VideoPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
