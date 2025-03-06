
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
	
			const detailsRow = document.createElement("tr");
			detailsRow.classList.add("details-row", "hidden");
			detailsRow.id = `details-${movie.id}`;
			detailsRow.innerHTML = `
				<td colspan="2">
					<div class="details-content">Loading details...</div>
				</td>
			`;
	
			container.appendChild(row);
			container.appendChild(detailsRow); // ✅ Ensure this exists
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

	function updateMovieTable(filteredMovies) {
		const container = document.getElementById("movies-container");
		container.innerHTML = "";
	
		if (filteredMovies.length === 0) {
			container.innerHTML = "<tr><td colspan='2'>No movies found.</td></tr>";
			return;
		}
	
		filteredMovies.forEach(movie => {
			let matchedNames = [];
	
			// ✅ Check if each field is not null or empty before adding
			if (movie.writers && movie.writers.trim() !== "") {
				matchedNames.push(`Writers: ${movie.writers}`);
			}
			if (movie.directors && movie.directors.trim() !== "") {
				matchedNames.push(`Directors: ${movie.directors}`);
			}
			if (movie.cast && movie.cast.trim() !== "") {
				matchedNames.push(`Cast: ${movie.cast}`);
			}
	
			const row = document.createElement("tr");
			row.classList.add("movie-row");
			row.dataset.movieId = movie.id;
	
			// ✅ If any names are present, display them
			row.innerHTML = `
				<td class="movie-title">
					${movie.title} ${matchedNames.length > 0 ? ` - ${matchedNames.join(" | ")}` : ""}
				</td>
			`;
	
			container.appendChild(row);
		});
	}
	

	document.addEventListener("click", function (event) {
		if (event.target.classList.contains("movie-title")) {
			const movieId = event.target.parentElement.dataset.movieId;
			const detailsRow = document.getElementById(`details-${movieId}`);
	
			if (!detailsRow) {
				console.warn(`Details row not found for movie ID: ${movieId}`);
				return; // ✅ Exit early if detailsRow doesn't exist
			}
	
			const allDetailsRows = document.querySelectorAll(".details-row");
	
			// Close all other open details rows
			allDetailsRows.forEach(row => {
				if (row !== detailsRow) {
					row.classList.add("hidden");
				}
			});
	
			detailsRow.classList.toggle("hidden"); // ✅ Safe to toggle now
		}
	});
	