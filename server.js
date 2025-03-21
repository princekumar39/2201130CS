const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;
let numberWindow = []; // Sliding window storage

// API Config
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQyNTY0NzY3LCJpYXQiOjE3NDI1NjQ0NjcsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjQ2YTc5NmNhLWUyMjItNDNkZi04Y2JkLTc0NTM1ZDNiMWVmZCIsInN1YiI6InByaW5jZS4yMjAxMTMwY3NAaWlpdGJoLmFjLmluIn0sImNvbXBhbnlOYW1lIjoiQWZmb3JkIE1lZGljYWwiLCJjbGllbnRJRCI6IjQ2YTc5NmNhLWUyMjItNDNkZi04Y2JkLTc0NTM1ZDNiMWVmZCIsImNsaWVudFNlY3JldCI6ImNEdmRqWVRPRUlVUE5pYU4iLCJvd25lck5hbWUiOiJQcmluY2UgS3VtYXIiLCJvd25lckVtYWlsIjoicHJpbmNlLjIyMDExMzBjc0BpaWl0YmguYWMuaW4iLCJyb2xsTm8iOiIyMjAxMTMwY3MifQ.Nd_7pTM-pabFTAD0SiNsOg5LtMnkuvmDVhoS48kI3Nw"; // Use your provided token directly
const NUMBER_APIS = {
    p: "http://20.244.56.144/test/primes",
    e: "http://20.244.56.144/test/even",
    f: "http://20.244.56.144/test/fibo",
    r: "http://20.244.56.144/test/rand"
};

// Function to fetch numbers from API
async function fetchNumbers(type) {
    try {
        const response = await axios.get(NUMBER_APIS[type], {
            headers: { Authorization: `Bearer ${AUTH_TOKEN}`}, 
            timeout: 500 
        });

        if (response.data && Array.isArray(response.data.numbers)) {
            return response.data.numbers;
        }
    } catch (error) {
        console.error(`Error fetching ${type} numbers:`, error.message);
    }
    return [];
}

// API Route: /numbers/:numberid
app.get('/numbers/:numberid', async (req, res) => {
    const numberType = req.params.numberid;
    if (!NUMBER_APIS[numberType]) {
        return res.status(400).json({ error: "Invalid number ID" });
    }

    const prevState = [...numberWindow]; // Store previous state
    const newNumbers = await fetchNumbers(numberType); // Fetch new numbers

    if (newNumbers.length > 0) {
        newNumbers.forEach(num => {
            if (!numberWindow.includes(num)) {
                if (numberWindow.length >= WINDOW_SIZE) {
                    numberWindow.shift(); // Remove oldest if limit exceeded
                }
                numberWindow.push(num);
            }
        });
    }

    // Calculate average
    const avg = numberWindow.length > 0
        ? (numberWindow.reduce((sum, num) => sum + num, 0) / numberWindow.length).toFixed(2)
        : 0;

    res.json({
        windowPrevState: prevState,
        windowCurrState: numberWindow,
        numbers: newNumbers,
        avg: parseFloat(avg) // Ensure number format
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});