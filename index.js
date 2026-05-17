// Pull in the npm packages.
const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load SUPABASE_URL and SUPABASE_KEY 
// before any code below tries to use them.
dotenv.config();

const app = express();

// Locally falls back to 3000; on Vercel uses whatever port it assigns.
const port = process.env.PORT || 3000;

// parse JSON request bodies
app.use(express.json());
app.use(express.static(__dirname + '/public'));

// Connect to  Supabase project using the keys from .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);




// Home page
app.get('/', (req, res) => {
  res.sendFile('public/index.html', { root: __dirname });
});

// About page
app.get('/about', (req, res) => {
  res.sendFile('public/about.html', { root: __dirname });
});

// Favorites page
app.get('/favorites', (req, res) => {
  res.sendFile('public/favorites.html', { root: __dirname });
});



// Fetches the full list of dog breeds from the public Dog CEO API.
app.get('/api/breeds', async (req, res) => {
  try {
    // fetch() makes an HTTP request to the external Dog CEO API.
    // wait til response arrives.
    const response = await fetch('https://dog.ceo/api/breeds/list/all');

    // .json() reads the response body and parses it as JSON.
    const data = await response.json();

    res.json(data);
  } catch (err) {
    // In case dog ceo api is down
    res.status(500).json({ error: err.message });
  }
});

// Fetches a random image for a specific breed from Dog CEO.
app.get('/api/dog-image/:breed', async (req, res) => {
  try {
    const breed = req.params.breed;
    const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Returns every saved favorite from the Supabase favorites table.
app.get('/api/favorites', async (req, res) => {
  const { data, error } = await supabase.from('favorites').select();

  if (error) {
    res.status(500).json(error);
  } else {
    res.json(data);
  }
});

// Saves a new favorite breed and image URL to Supabase.
app.post('/api/favorites', async (req, res) => {
  const breed = req.body.breed;
  const image_url = req.body.image_url;

  const { data, error } = await supabase
    .from('favorites')
    .insert({
      breed: breed,
      image_url: image_url,
    })
    .select();

  if (error) {
    res.status(500).json(error);
  } else {
    res.json(data);
  }
});

// Removes a favorite by its database ID.
app.delete('/api/favorites/:id', async (req, res) => {
  const id = req.params.id;
  const { data, error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', id)
    .select();

  if (error) {
    res.status(500).json(error);
  } else {
    res.json(data);
  }
});


app.listen(port, () => {
  console.log(`App is available on port: ${port}`);
});

module.exports = app;