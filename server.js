const fs = require('fs');
const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

const db = require('./db/db.json')

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function createNewNote(body, db) {
  const note = body;
  console.log(note);
  db.push(note);
  fs.writeFile('./db/db.json', JSON.stringify(db), function(err) {
    if (err) {
      return console.log(err);
    } else {
    console.log("New note added!");
    }
  })
}

app.get("/", function(req, res) {
  res.json(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function(req, res) {
  // res.send("Welcome to the Star Wars Page!")
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get('/api/notes', (req, res) => {
    res.json(db);
})

app.post('/api/notes', (req, res) => {
    // req.body is where our incoming content will be
    console.log(db);
    // if (parseInt(db[db.length-1].id) > 900) {
    //   for(i = 0; i < parseInt(db[db.length-1].id); i++) {
    //     if (db[i])
    //   }
    // }
    if (db.length === 0) {
      req.body.id = "0";
    } else {
      req.body.id = (parseInt(db[db.length-1].id)+1).toString();
    }
      console.log(req.body);
    // db.push(req.body);
    // console.log(db);
    const note = createNewNote(req.body, db);
    res.json(note);
  });

app.delete('/api/notes/:id', (req, res) => {
    for (let i = 0; i < db.length; i++) {
        if (db[i].id === req.params.id) {
          db.splice(i, 1);
          break;
        }
    }
    fs.writeFile('./db/db.json', JSON.stringify(db), function(err) {
      if (err) {
        return console.log(err);
      } else {
        console.log("Your note was deleted!");
      }
      res.json(db);
    })

})  

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });