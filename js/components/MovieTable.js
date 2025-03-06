
	import { fetchMovies } from "../api/MoviesAPI.js";
	import { openModal } from "./MovieDetailsModal.js";


	export let allMovies = [];

	export async function displayMovies() {
		const container = document.getElementById("movies-container");
		container.innerHTML = "<tr><td colspan='2'>Loading movies...</td></tr>";

		const movies = await fetchMovies();
		if (movies.length === 0) {
			container.innerHTML = "<tr><td colspan='2'>No movies found.</td></tr>";
			return;
		}

		allMovies = movies;

		container.innerHTML = "";

		movies.forEach(movie => {
			const row = document.createElement("tr");
			row.classList.add("movie-row");
			row.dataset.movieId = movie.id;
			row.innerHTML = `<td class="movie-title">${movie.title}</td>`;

			container.appendChild(row);
		});
	}

	export function renderMovieList(movies) {
		const container = document.getElementById("movies-container");
		container.innerHTML = "";

		movies.forEach(movie => {
			const row = document.createElement("tr");
			row.classList.add("movie-row");
			row.dataset.movieId = movie.id;
			row.dataset.mpa = movie.mpa_rating || "";

			row.innerHTML = `<td class="movie-title">${movie.title} (${movie.mpa_rating || "N/A"})</td>`;

			container.appendChild(row);
		});
	}

	export function updateMovieTable(filteredMovies) {
		const container = document.getElementById("movies-container");
		container.innerHTML = "";

		if (filteredMovies.length === 0) {
			container.innerHTML = "<tr><td colspan='2'>No movies found.</td></tr>";
			return;
		}

		filteredMovies.forEach(movie => {
			const row = document.createElement("tr");
			row.classList.add("movie-row");
			row.dataset.movieId = movie.id;
			row.innerHTML = `<td class="movie-title">${movie.title}</td>`;

			container.appendChild(row);
		});
	}

	document.addEventListener("click", function (event) {
		if (event.target.classList.contains("movie-title")) {
			const movieId = event.target.parentElement.dataset.movieId;
			const detailsRow = document.getElementById(`details-${movieId}`);
			const allDetailsRows = document.querySelectorAll(".details-row");

			allDetailsRows.forEach(row => {
				if (row !== detailsRow) {
					row.classList.add("hidden");
				}
			});

			detailsRow.classList.toggle("hidden");
		}
	});