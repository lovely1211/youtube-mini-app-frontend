import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./authProvider"; 

const API_BASE_URL = "https://youtube-mini-app-backend.onrender.com/api";

const VideoPage = () => {
    const [video, setVideo] = useState(null);
    const [videoId, setVideoId] = useState("");  
    const [newTitle, setNewTitle] = useState("");
    const [comment, setComment] = useState("");
    const { user, loading, logoutUser } = useAuth();

    const storedToken = localStorage.getItem("authToken");

    const logout = () => {
        axios.get(`${API_BASE_URL}/logout`, { withCredentials: true })
        .then(() => {
            localStorage.removeItem("authToken");
            logoutUser(); 
            window.location.href = "/auth"; 
        })
        .catch(err => console.log("Logout error:", err));
    };

    // Fetch Video
    const fetchVideo = () => {
        if (!videoId.trim()) return;
    
        axios.get(`${API_BASE_URL}/videos/${videoId}`)
            .then((res) => setVideo(res.data))
            .catch(() => setVideo(null));  
    };

    // Update Title
    const updateTitle = () => {
        if (!video) return;
        
        axios.put(`${API_BASE_URL}/videos/${video.videoId}`, { title: newTitle }, {
            headers: {
                Authorization: `Bearer ${storedToken}`,
                "Content-Type": "application/json"
            }
        })
        .then((res) => setVideo(res.data));
    };

    // Add Comment
    const addComment = () => {
        if (!video) return;

        axios.post(`${API_BASE_URL}/comments`, { 
            videoId: video.videoId, 
            text: comment, 
            author: user?.name 
        }, {
            headers: {
                Authorization: `Bearer ${storedToken}`,
                "Content-Type": "application/json"
            }
        })
        .then(() => setComment(""));
    };

    // Delete Comment
    const deleteComment = (commentId) => {
        if (!video) return;

        axios.delete(`${API_BASE_URL}/comments/${commentId}`, {
            headers: {
                Authorization: `Bearer ${storedToken}`
            }
        })
        .then(() => {
            setVideo((prev) => ({
                ...prev,
                comments: prev.comments.filter((c) => c._id !== commentId),
            }));
        });
    };

    if (loading) return <div className="text-center text-lg font-semibold mt-10">Loading...</div>;
    if (!user) return <Navigate to="/auth" />;

    return (
        <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">YouTube Video Editor</h1>
                <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded cursor-pointer">
                    Logout
                </button>
            </div>

            <div className="flex space-x-2 mb-4">
                <input
                    className="border border-gray-300 p-2 rounded w-full"
                    value={videoId}
                    onChange={(e) => setVideoId(e.target.value)}
                    placeholder="Enter YouTube Video ID"
                />
                <button onClick={fetchVideo} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                    Fetch Video
                </button>
            </div>

            {!video && videoId && <div className="text-red-500">No video found! Please enter a valid video ID.</div>}

            {video && (
                <>
                    <h2 className="text-xl font-semibold">{video.title}</h2>
                    <div className="mb-4">
                        <iframe
                            className="w-full rounded-lg"
                            height="315"
                            src={`https://www.youtube.com/embed/${video.videoId}`}
                            title="YouTube video"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Update Title */}
                    <div className="flex space-x-2">
                        <input
                            className="border border-gray-300 p-2 rounded w-full"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="New title"
                        />
                        <button onClick={updateTitle} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                            Update
                        </button>
                    </div>

                    {/* Add Comment */}
                    <div className="flex space-x-2 mt-4">
                        <input
                            className="border border-gray-300 p-2 rounded w-full"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment"
                        />
                        <button onClick={addComment} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded cursor-pointer">
                            Comment
                        </button>
                    </div>

                    {/* Show Comments */}
                    <div className="mt-4">
                        {video.comments?.map((c) => (
                            <div key={c._id} className="flex justify-between items-center p-2 border-b">
                                <span>{c.text}</span>
                                <button onClick={() => deleteComment(c._id)} className="text-red-500 cursor-pointer">❌</button>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default VideoPage;
