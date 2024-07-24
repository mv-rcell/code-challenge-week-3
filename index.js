document.addEventListener('DOMContentLoaded', function() {
  const filmsList = document.getElementById('films');
  const movieDetails = document.getElementById('movie-details');

  // Function to fetch movies from JSON server
  async function fetchMovies() {
    try {
      const response = await fetch('http://localhost:3000/films');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }

  // Function to fetch movie details by ID
  async function fetchMovieDetails(movieId) {
    try {
      const response = await fetch(`http://localhost:3000/films/${movieId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching movie ${movieId} details:`, error);
    }
  }

  // Function to update movie details in the UI
  function updateMovieDetails(movie) {
    const { title, runtime, showtime, tickets_sold, capacity, description, poster } = movie;
    const availableTickets = capacity - tickets_sold;

    movieDetails.innerHTML = `
      <h2>${title}</h2>
      <img src="${poster}" alt="${title} Poster">
      <p><strong>Runtime:</strong> ${runtime} mins</p>
      <p><strong>Showtime:</strong> ${showtime}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Available Tickets:</strong> ${availableTickets}</p>
      <button id="btn-buy" class="btn-buy" ${availableTickets === 0 ? 'disabled' : ''}>Buy Ticket</button>
    `;

    const buyButton = document.getElementById('btn-buy');
    buyButton.addEventListener('click', async function() {
      if (availableTickets > 0) {
        // Update UI
        availableTickets--;
        movieDetails.querySelector('p:nth-child(5)').textContent = `Available Tickets: ${availableTickets}`;
        buyButton.disabled = availableTickets === 0;
        
        // Optional: Update backend using PATCH request
        // const updatedTicketsSold = tickets_sold + 1;
        // await fetch(`http://localhost:3000/films/${movie.id}`, {
        //   method: 'PATCH',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({ tickets_sold: updatedTicketsSold })
        // });

      } else {
        alert('Sorry, this showing is sold out!');
      }
    });
  }

  // Function to populate movies in the sidebar
  async function populateMovies() {
    const movies = await fetchMovies();
    filmsList.innerHTML = '';
    movies.forEach(movie => {
      const li = document.createElement('li');
      li.textContent = movie.title;
      li.classList.add('film', 'item');
      li.addEventListener('click', async function() {
        updateMovieDetails(movie);
      });
      filmsList.appendChild(li);
    });

    // Display details of the first movie by default
    if (movies.length > 0) {
      updateMovieDetails(movies[0]);
    }
  }

  // Initialize the application
  populateMovies();
});
