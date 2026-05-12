const express = require('express');
const bodyParser = require('body-parser');
const supabaseClient = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const app = express();
const port = 3000;
dotenv.config();
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);




app.get('/', (req, res) => {
  res.sendFile('public/index.html', { root: __dirname });
});
app.get('/api/breeds', async (req, res) => {
  const response = await fetch('https://dog.ceo/api/breeds/list/all');
  const data = await response.json();
  res.json(data);
});
app.get('/api/dog-image/:breed', async (req, res) => {
  const breed = req.params.breed;
  const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
  const data = await response.json();
  res.json(data);
});
app.get('/api/favorites', async (req, res) => {
  const { data, error } = await supabase.from('favorites').select();

  if (error) {
    res.status(500).json(error);
  } else {
    res.json(data);
  }
});





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
app.listen(port, () => {
  console.log(`App is available on port: ${port}`);
});