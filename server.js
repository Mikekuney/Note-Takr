const express = require('express');
const fs = require('fs');
const path = require('path');
const notes = require("./db/db.json");
const uuid = require("./helpers/uuid.js");

const PORT = process.env.PORT || 3001;

const app = express();

// Setting up Express app to handle data parsing and
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// setting static folder
app.use(express.static('public'));

// post for new notes
let newId = uuid();
let parsedNotes;
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
    
    // DEstructuring assignment for the request body
    const { title, text } = req.body;

    // If all required properties are present
    if (title && text) {
        // Variable for object to be saved
        const newNote = {
            id: newId,
            title: `${title}`,
            text: `${text}`
        };

        // obtain existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                //parse data into JSON object

                parsedNotes = JSON.parse(data);

                // Add new note 
                parsedNotes.notes.push(newNote);
                notes;
                // Write updates notes back to the readFile
                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 2),
                    (writeErr) => {
                        if (writeErr) {
                            console.error(writeErr);
                        } else {
                            console.info('Note added');

                            res.send('added note');
                        }
                    }
                );
            }
        });
    } else {
        res.json('Error, missing required fields');
    }
});

// Get for delete
app.delete('/api/notes/:id', (req, res) => {
    // Log that a DELETE request was received
    console.info(`${req.method} request received to delete a note`);

    // Obtain existing notes
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            //parse data into JSON object

            parsedNotes = JSON.parse(data);

            // Find note by id

            const result = req.params.id;
            console.log(result);
            parsedNotes.notes.forEach((element) => {
                if (result === element.id) {
                    var index = parsedNotes.notes.findIndex(function (o) {
                        return o.id === element.id;
                        });
                        if (index !== -1) parsedNotes.notes.splice(index, 1);
                }
            });

            console.log(parsedNotes);
            // Write updates notes back to the readFile
            fs.writeFile(
                './db/db.json',
                JSON.stringify(parsedNotes, null, 2),
                (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                    } else {
                        console.info('Note deleted');
                        res.send('deleted note');
                    }
                }
            );
        }
    });
});

//route to db.json notes
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            //parse data into JSON object

            const parsedNotes = JSON.parse(data);
            res.json(parsedNotes.notes);
        }
    });
});

// route to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});
// route to index.HTML
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//server listening
app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
