async function loadFavorites() {
  try {
    const response = await fetch('/api/favorites');
    const favorites = await response.json();

    renderFavorites(favorites);
  } catch (err) {
    // Network issue or server crashed 
    console.error('Failed to load favorites', err);
    document.getElementById('favoritesGrid').innerHTML =
      '<p id="emptyState">Could not load favorites. Please refresh.</p>';
  }
}

// Draws the cards on the page
function renderFavorites(favorites) {
  const grid = document.getElementById('favoritesGrid');
  grid.innerHTML = ''; // clear out the spinner


  // before the user saves anything
  if (!favorites || favorites.length === 0) {
    grid.innerHTML = `
      <div id="emptyState" class="animate__animated animate__fadeIn">
        🐾 No favorites yet! Head to the <a href="/">Home page</a> and save some breeds.
      </div>`;
    return; // no cards to render.
  }

  //  each favorite from the database, build a card.
  favorites.forEach((fav, i) => {
    const card = document.createElement('div');

    //  Animate.css for the fade in.
    card.className = 'dog-card animate__animated animate__fadeInUp';

    // Cascade animation
    card.style.animationDelay = `${i * 0.05}s`;


    card.innerHTML = `
      <img src="${fav.image_url}" alt="${fav.breed}">
      <h3>${fav.breed}</h3>
      <button class="danger" data-id="${fav.id}">Remove</button>
    `;

    // wire the remove button.
    card.querySelector('button').addEventListener('click', () => {
      removeFavorite(fav.id, card);
    });

    grid.appendChild(card);
  });
}


// calls the delete endpoint
async function removeFavorite(id, cardEl) {
  try {
    const response = await fetch(`/api/favorites/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      // make sure it doesnt conflict with the exit animation
      cardEl.classList.remove('animate__fadeInUp');

      cardEl.classList.add('animate__fadeOutRight');

    // wait for animation to finish before reloading
      cardEl.addEventListener('animationend', () => loadFavorites(), { once: true });
    } else {
      alert('Could not remove favorite.');
    }
  } catch (err) {
    console.error('Delete failed', err);
  }
}



loadFavorites();