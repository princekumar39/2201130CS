const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 9876;

// API details
const API_BASE_URL = "http://20.244.56.144/test";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNTY3MTE3LCJpYXQiOjE3NDI1NjY4MTcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQ2YTc5NmNhLWUyMjItNDNkZi04Y2JkLTc0NTM1ZDNiMWVmZCIsInN1YiI6InByaW5jZS4yMjAxMTMwY3NAaWlpdGJoLmFjLmluIn0sImNvbXBhbnlOYW1lIjoiQWZmb3JkIE1lZGljYWwiLCJjbGllbnRJRCI6IjQ2YTc5NmNhLWUyMjItNDNkZi04Y2JkLTc0NTM1ZDNiMWVmZCIsImNsaWVudFNlY3JldCI6ImNEdmRqWVRPRUlVUE5pYU4iLCJvd25lck5hbWUiOiJQcmluY2UgS3VtYXIiLCJvd25lckVtYWlsIjoicHJpbmNlLjIyMDExMzBjc0BpaWl0YmguYWMuaW4iLCJyb2xsTm8iOiIyMjAxMTMwY3MifQ.IPOZOkW38D3nJjPFbAx6gtMjsJcx7r5HpnaUB0enj1c"
// Middleware to set Authorization header
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Authorization": `Bearer ${AUTH_TOKEN}`,
    },
});

// GET: Fetch all users
app.get("/users", async (req, res) => {
    try {
        const response = await apiClient.get("/users");
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: "Failed to fetch users" });
    }
});

// GET: Fetch posts (latest/popular)
app.get("/posts", async (req, res) => {
    const type = req.query.type || "latest"; // Default to latest
    try {
        const response = await apiClient.get(`/posts?type=${type}`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: `Failed to fetch ${type} posts` });
    }
});

// GET: Fetch posts of a specific user
app.get("/users/:userid/posts", async (req, res) => {
    const userId = req.params.userid;
    try {
        const response = await apiClient.get(`/users/${userId}/posts`);
        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error:` Failed to fetch posts for user ${userId}` });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});