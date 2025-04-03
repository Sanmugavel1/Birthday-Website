const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to handle JSON & URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname)); // Serves static files (CSS, JS, images)

// Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission for Roll No & Treat
app.post('/submit', (req, res) => {
    const { roll, treat } = req.body;
    const entry = { roll, treat };

    fs.readFile('data.json', (err, data) => {
        let jsonData = { entries: [], wishes: [] };
        if (!err && data.length) {
            jsonData = JSON.parse(data);
        }
        jsonData.entries.push(entry);

        fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).send('Error saving data');
            res.json({ success: true });
        });
    });
});

// Handle secret wish submission
app.post('/wish', (req, res) => {
    const { wish } = req.body;

    fs.readFile('data.json', (err, data) => {
        let jsonData = { entries: [], wishes: [] };
        if (!err && data.length) {
            jsonData = JSON.parse(data);
        }
        jsonData.wishes.push(wish);

        fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
            if (err) return res.status(500).send('Error saving wish');
            res.json({ success: true });
        });
    });
});

// Fetch submitted entries
app.get('/entries', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) return res.json([]);
        const jsonData = JSON.parse(data);
        res.json(jsonData.entries);
    });
});

// Fetch submitted wishes
app.get('/wishes', (req, res) => {
    fs.readFile('data.json', (err, data) => {
        if (err) return res.json([]);
        const jsonData = JSON.parse(data);
        res.json(jsonData.wishes);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});
