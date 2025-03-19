import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthProvider from "./components/authProvider";
import AuthPage from "./components/auth";
import VideoPage from "./components/video";

const App = () => {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<VideoPage />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
};

export default App;
