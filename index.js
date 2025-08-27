require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urlDatabase = [];


//URL shortener endpoint
app.post("/api/shorturl", (req, res) => {
  const original_url = req.body.url;

  const urlPattern = /^(http|https):\/\/.+$/;
  if (!urlPattern.test(original_url)) {
    return res.json({ error: "invalid url" });
  }

  const short_url = urlDatabase.length + 1;
  urlDatabase.push({ original_url, short_url });

  res.json({ original_url, short_url });
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const short_url = parseInt(req.params.short_url);
  const found = urlDatabase.find(u => u.short_url === short_url);

  if (found) {
    res.redirect(found.original_url);
  } else {
    res.json({ error: "invalid url" });
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
