import { fetchMovies } from "../api/MoviesAPI.js";
import { openModal } from "./MovieDetailsModal.js";

export async function displayMovies() {
    const container = document.getElementById("movies-container");
    container.innerHTML = "<tr><td colspan='2'>Loading movies...</td></tr>";

    const movies = await fetchMovies();
    if (movies.length === 0) {
        container.innerHTML = "<tr><td colspan='2'>No movies found.</td></tr>";
        return;
    }

    container.innerHTML = ""; // Clear placeholder

    movies.forEach(movie => {
        const row = document.createElement("tr");
        row.classList.add("movie-row");
        row.dataset.movieId = movie.id;
        row.innerHTML = `<td class="movie-title">${movie.title}</td>`;

        const detailsRow = document.createElement("tr");
        detailsRow.classList.add("details-row", "hidden");
        detailsRow.id = `details-${movie.id}`;
        detailsRow.innerHTML = `
            <td colspan="2">
                <div class="details-options">
                    <button class="details-btn" data-movie-id="${movie.id}" data-section="description">Description</button>
                    <button class="details-btn" data-movie-id="${movie.id}" data-section="movie-details">Movie Details</button>
                    <button class="details-btn" data-movie-id="${movie.id}" data-section="cast-crew">Cast & Crew</button>
                    <button class="details-btn" data-movie-id="${movie.id}" data-section="oscars">Oscars</button>
                    <button class="details-btn" data-movie-id="${movie.id}" data-section="analytics">Analytics</button>
                </div>
            </td>
        `;

        container.appendChild(row);
        container.appendChild(detailsRow);
    });
}

// Event Listener for clicking movies
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("movie-title")) {
        const movieId = event.target.parentElement.dataset.movieId;
        const detailsRow = document.getElementById(`details-${movieId}`);
        detailsRow.classList.toggle("hidden");
    }
});

// Event Listener for clicking modal buttons
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("details-btn")) {
        const movieId = event.target.dataset.movieId;
        const section = event.target.dataset.section;
        openModal(movieId, section);
    }
});

//Hides Theme Buttons
document.addEventListener("DOMContentLoaded", function () {
    const styleToggleBtn = document.getElementById("style-toggle-btn");
    const themeSection = document.getElementById("theme-section");

    // Initially hide the theme section
    themeSection.style.display = "none";

    // Show the theme section when the button is clicked
    styleToggleBtn.addEventListener("click", function () {
        themeSection.style.display = "block";
    });

    // Hide the theme section when the mouse leaves the area
    themeSection.addEventListener("mouseleave", function () {
        themeSection.style.display = "none";
    });
});
