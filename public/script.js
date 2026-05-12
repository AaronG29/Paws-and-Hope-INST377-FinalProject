async function loadDogs() {

    const response = await fetch('/api/breeds');
    const data = await response.json();

    const breedContainer = document.getElementById('breedContainer');

    const breeds = Object.keys(data.message);

    const randomBreeds = breeds.slice(0, 12);

    for (let breed of randomBreeds) {

        const imageResponse = await fetch(`/api/dog-image/${breed}`);
        const imageData = await imageResponse.json();

        const dogCard = document.createElement('div');
        dogCard.className = 'dog-card';

        dogCard.innerHTML = `
            <img src="${imageData.message}" alt="${breed}">
            <h3>${breed}</h3>
            <button onclick="saveFavorite('${breed}', '${imageData.message}')">
                Save Breed
            </button>
        `;

        breedContainer.appendChild(dogCard);
    }
}





async function saveFavorite(breed, imageUrl) {

    const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            breed: breed,
            image_url: imageUrl
        })
    });

    if (response.ok) {
        alert(`${breed} added to favorites!`);
    } else {
        alert('Error saving favorite');
    }
}
loadDogs();