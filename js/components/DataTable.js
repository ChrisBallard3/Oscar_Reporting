
	import { fetchMovies } from "../api/MoviesAPI.js";
	import { loadMovieModal } from "./MovieModal.js";


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
			container.appendChild(detailsRow);
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

	function updateDataTable(filteredMovies) {
		const container = document.getElementById("movies-container");
		container.innerHTML = "";

		if (filteredMovies.length === 0) {
			container.innerHTML = "<tr><td colspan='2'>No movies found.</td></tr>";
			return;
		}

		filteredMovies.forEach(movie => {
			let matchedNames = [];

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

			row.innerHTML = `
				<td class="movie-title">
					${movie.title} ${matchedNames.length > 0 ? ` - ${matchedNames.join(" | ")}` : ""}
				</td>
			`;

			container.appendChild(row);
		});
	}

	document.addEventListener("click", async function (event) {
		if (event.target.classList.contains("movie-title")) {
			const movieId = event.target.closest(".movie-row")?.dataset.movieId;
			const detailsRow = document.getElementById(`details-${movieId}`);

			if (!movieId) {
				console.warn("Movie ID not found!");
				return;
			}

			if (detailsRow) {
				const isHidden = detailsRow.classList.contains("hidden");

				if (isHidden) {
					await fetchAndDisplayMovieDetails(movieId, detailsRow); 
				}

				detailsRow.classList.toggle("hidden");
			} else {
				console.warn(`Details row not found for movie ID: ${movieId}`);
			}
		}
	});
	

	async function fetchAndDisplayMovieDetails(movieId, detailsRow) {
		try {
			const response = await fetch(`http://localhost:8888/Oscar_Reporting/api/movies/get_full_movie_details.php?id=${movieId}`);
			const movieDetails = await response.json();

			//Check if movie exists
			if (!movieDetails || movieDetails.error) {
				detailsRow.innerHTML = `<td colspan="2"><strong>Error:</strong> Could not load movie details.</td>`;
				console.error("Error fetching movie details:", movieDetails.error || "Unknown error");
				return;
			}

			detailsRow.innerHTML = `
				<td colspan="2">
					<!-- Buttons to open modal in different sections -->
					<button class="open-modal-btn" data-movie-id="${movieId}" data-section="description">Description</button>
					<button class="open-modal-btn" data-movie-id="${movieId}" data-section="movie-details">Movie Details</button>
					<button class="open-modal-btn" data-movie-id="${movieId}" data-section="cast-crew">Cast & Crew</button>
					<button class="open-modal-btn" data-movie-id="${movieId}" data-section="oscars">Oscars</button>
					<button class="open-modal-btn" data-movie-id="${movieId}" data-section="analytics">Analytics</button>
				</td>
			`;
		} catch (error) {
			console.error("Error fetching movie details:", error);
			detailsRow.innerHTML = `<td colspan="2"><strong>Error:</strong> Failed to load movie details.</td>`;
		}
	}

	document.addEventListener("click", function (event) {
		if (event.target.classList.contains("details-content")) {
			const movieId = event.target.closest(".details-row")?.id.replace("details-", "");

			if (!movieId) {
				console.warn("Movie ID not found!");
				return;
			}

			console.log("Opening Modal for Movie ID:", movieId);
			loadMovieModal(movieId, section);
		}
	});

	document.addEventListener("click", function (event) {
		if (event.target.classList.contains("open-modal-btn")) {
			const movieId = event.target.dataset.movieId;
			const section = event.target.dataset.section || "description"; 

			if (!movieId) {
				console.warn("Movie ID not found for modal!");
				return;
			}

			console.log(`Opening Modal for Movie ID: ${movieId}, Section: ${section}`);
			loadMovieModal(movieId, section);
		}
	});

	//Makes it where only one hidden row open at a time
		document.addEventListener("click", async function (event) {
			if (!event.target.classList.contains("movie-title")) return;

			const movieId = event.target.closest(".movie-row")?.dataset.movieId;
			if (!movieId) {
				console.warn("Movie ID not found!");
				return;
			}

			const detailsRow = document.getElementById(`details-${movieId}`);
			const allDetailsRows = document.querySelectorAll(".details-row:not(.hidden)");

			allDetailsRows.forEach(row => {
				if (row !== detailsRow) {
					row.classList.add("hidden");
				}
			});

			if (detailsRow.classList.contains("hidden")) {
				await fetchAndDisplayMovieDetails(movieId, detailsRow);
				detailsRow.classList.remove("hidden"); 
			}
		});

	document.addEventListener("click", async function (event) {
		if (event.target.classList.contains("movie-title")) {
			const movieId = event.target.closest(".movie-row")?.dataset.movieId;
			const detailsRow = document.getElementById(`details-${movieId}`);

			if (!movieId) {
				console.warn("Movie ID not found!");
				return;
			}

			document.querySelectorAll(".movie-title").forEach(title => {
				title.classList.remove("centered-title");
			});

			event.target.classList.add("centered-title");

			const allDetailsRows = document.querySelectorAll(".details-row:not(.hidden)");

			if (!detailsRow.classList.contains("hidden")) {
				return;
			}

			allDetailsRows.forEach(row => {
				if (row !== detailsRow) {
					row.classList.add("hidden");
				}
			});

			await fetchAndDisplayMovieDetails(movieId, detailsRow);
			detailsRow.classList.remove("hidden");
		}
	});