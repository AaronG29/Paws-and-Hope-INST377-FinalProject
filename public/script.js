
async function loadDogs() {
  try {
    // Fetch the breed list
    const response = await fetch('/api/breeds');
    const data = await response.json();

    // get the breed names
    const breeds = Object.keys(data.message);

    // For variety
    const shuffled = breeds.sort(() => 0.5 - Math.random());
    const randomBreeds = shuffled.slice(0, 12);

    // get all 12 images in parallel
    const imageResults = await Promise.all(
      randomBreeds.map(async (breed) => {
        
        // For each breed, hit the endpoint
        const r = await fetch(`/api/dog-image/${breed}`);
        const d = await r.json();

        // Return an object combining the breed name and image URL
        return { breed, image: d.message };
      })
    );

    // first 6 to the carousel, all 12 to the grid.
    renderSwiper(imageResults.slice(0, 6));
    renderBreedGrid(imageResults);

  } catch (err) {
    // If anything fails, don't crash 
    // than show a message
    console.error('Failed to load dogs', err);
    const container = document.getElementById('breedContainer');
    if (container) container.innerHTML = '<p>Could not load breeds. Please refresh.</p>';
  }
}

// initalizies the carousel
function renderSwiper(items) {
  const wrapper = document.getElementById('swiperWrapper');
  if (!wrapper) return; 
  
  // all the html for all 6 slides as one big string
  wrapper.innerHTML = items.map(({ breed, image }) => `
    <div class="swiper-slide">
      <img src="${image}" alt="${breed}">
      <div class="caption">${breed}</div>
    </div>
  `).join('');


  // swiper intalizses 
  new Swiper('#featuredSwiper', {
    loop: true, // when it reaches the last slide, jump back to first
    autoplay: {
      delay: 3000,                
      disableOnInteraction: false   // keep autoplaying even after user interacts
    },
    pagination: {
      el: '.swiper-pagination',     
      clickable: true               // clicking a dot jumps to that slide
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    effect: 'slide'                 
  });
}
// to render the 12 card grid below the carousel
function renderBreedGrid(items) {
  const container = document.getElementById('breedContainer');
  if (!container) return;
  container.innerHTML = ''; // clear out the spinner before rendering
  
  // stagger animation
  items.forEach(({ breed, image }, i) => {
    const dogCard = document.createElement('div');


    dogCard.className = 'dog-card animate__animated animate__fadeInUp';

    // so the card can cascade
    dogCard.style.animationDelay = `${i * 0.05}s`;


    dogCard.innerHTML = `
      <img src="${image}" alt="${breed}">
      <h3>${breed}</h3>
      <button data-breed="${breed}" data-image="${image}">Save Breed</button>
    `;

 
    dogCard.querySelector('button').addEventListener('click', (e) => {
      saveFavorite(breed, image, e.target);
    });

    // Add the finished card to the container
    container.appendChild(dogCard);
  });
}


async function saveFavorite(breed, imageUrl, buttonEl) {
  try {
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
      buttonEl.textContent = '✓ Saved!';
      buttonEl.disabled = true;
      buttonEl.classList.add('animate__animated', 'animate__pulse');
    } else {
      buttonEl.textContent = 'Error — try again';
    }
  } catch (err) {
    console.error('Save failed', err);
    buttonEl.textContent = 'Error — try again';
  }
}


loadDogs();