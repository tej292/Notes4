const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Home route - list files
app.get('/', function (req, res) {
    fs.readdir('./Files', function (err, files) {
        if (err) {
            console.error("Error reading directory:", err);
            return res.status(500).send("Server error");
        }
        res.render("index", { files: files });
    });
});

// View file content
app.get('/Files/:filename', function (req, res) {
    const filePath = path.join(__dirname, 'Files', req.params.filename);
    fs.readFile(filePath, "utf-8", function (err, filedata) {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(404).send("File not found");
        }
        res.render('show', { filename: req.params.filename, filedata: filedata });
    });
});

// Edit file - show edit form
app.get('/edit/:filename', function (req, res) {
    const filePath = path.join(__dirname, 'Files', req.params.filename);
    fs.readFile(filePath, "utf-8", function (err, filedata) {
        if (err) {
            console.error("Error reading file:", err);
            return res.status(404).send("File not found");
        }
        res.render('edit', { filename: req.params.filename, filedata: filedata });
    });
});

// Edit file - save changes
app.post('/edit', function (req, res) {
    const filePath = path.join(__dirname, 'Files', req.body.filename);
    fs.writeFile(filePath, req.body.details, function (err) {
        if (err) {
            console.error("Error writing file:", err);
            return res.status(500).send("Failed to save file");
        }
        res.redirect(`/Files/${req.body.filename}`);
    });
});

// Create new file
app.post('/create', function (req, res) {
    const fileName = req.body.title.split(' ').join('') + '.txt';
    const filePath = path.join(__dirname, 'Files', fileName);
    fs.writeFile(filePath, req.body.details, function (err) {
        if (err) {
            console.error("Error creating file:", err);
            return res.status(500).send("Failed to create file");
        }
        res.redirect('/');
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
