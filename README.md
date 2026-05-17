# Paws and Hope
## Description
We created a dog breed browsing website called Paws and Hope Animal Rescue for our final project for INST377. Users can browse dog breeds, search for breeds, view dog images, and save favorites. The website uses the Dog CEO API along with Supabase.

## Target Browser
Google Chrome

# Developer Manual
## Running the Project

Clone the repository:
git clone https://github.com/AaronG29/Paws-and-Hope-INST377-FinalProject.git

Install dependencies:
npm install

Create a `.env` file and add:
SUPABASE_URL=SupabaseURL
SUPABASE_KEY=SupabaseKey

Start server:
npm start

Open this:
http://localhost:3000


## API Endpoints
### GET /api/breeds
Gets all dog breeds from the Dog CEO API
### GET /api/dog-image/:breed
Gets a random image for a selected breed
### GET /api/favorites
Gets saved favorite breeds from Supabase
### POST /api/favorites
Adds a breed into the favorites database

## Bugs
Invalid breed searches may return an error

## Future Improvements
Add more breed filters
Improve mobile layout