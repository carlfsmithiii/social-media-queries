const { Client } = require('pg');
const express = require('express');

// create an express application
const app = express();
app.use(express.json());
// create a postgresql client
const client = new Client({
    database: 'social-media'
});

// route handlers go here
app.get('/users', (req, res) => {
    client.query('SELECT * FROM users', (err, result) => {
        res.send(result.rows);
    });
});

app.post('/users', (req, res) => {
    const text = 'INSERT INTO users (username, bio) VALUES ($1, $2) RETURNING *';
    const values = [req.body.username, req.body.bio];
    console.log(req.body);
    console.log(values);
    client.query(text, values, (err, result) => {
        if (err) {
            res.status(400).send();
            return console.log(err);
        }
        console.log(result.rows[0]);

        res.status(200).send(JSON.stringify(result.rows[0]));
    });
});

app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    client.query('SELECT * FROM users WHERE id=($1)', [id], (err, result) => {
        if (err) {
            res.status(400).send();
            return console.log(err);
        }
        res.status(200).send(JSON.stringify(result.rows[0]));
    });
});



// start a server that listens on port 3000 and connects the sql client on success
app.listen(3000, () => {
    client.connect();
});