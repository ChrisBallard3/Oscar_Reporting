
	import { renderMovieList, allMovies } from "./MovieTable.js";


	async function fetchMPARatings() {
		try {
			const response = await fetch("http://localhost:8888/Oscar_Reporting/api/movies/get_mpa_ratings.php");
			return await response.json();
		} catch (error) {
			console.error("Error fetching MPA ratings:", error);
			return [];
		}
	}

	async function fetchMovieRuntimes() {
		try {
			const response = await fetch("http://localhost:8888/Oscar_Reporting/api/movies/get_movie_runtimes.php");
			return await response.json();
		} catch (error) {
			console.error("Error fetching movie runtimes:", error);
			return [];
		}
	}

	export async function applyFilters() {
		console.log("All Movies Before Filtering:", allMovies);

		if (allMovies.length === 0) {
			console.error("Error: No movies available for filtering!");
			return;
		}

		const selectedMPA = document.getElementById("mpa-filter").value;
		const minRuntime = parseInt(document.getElementById("filter-runtime-min").value) || 0;
		const maxRuntime = parseInt(document.getElementById("filter-runtime-max").value) || Infinity;

		const [runtimeData, mpaData] = await Promise.all([
			fetchMovieRuntimes(),
			fetchMPARatings()
		]);

		console.log("Fetched MPA Data:", mpaData);
		console.log("Fetched Runtime Data:", runtimeData);

		//Merge MPA & Runtime
		const moviesWithFilters = allMovies.map(movie => {
			const mpaInfo = mpaData.find(mpa => mpa.id === movie.id);
			const runtimeInfo = runtimeData.find(runtime => runtime.id === movie.id);

			return {
				...movie,
				mpa_rating: mpaInfo ? mpaInfo.mpa_rating : null,
				runtime: runtimeInfo ? runtimeInfo.runtime : null
			};
		});

		//Apply Filters
		const filteredMovies = moviesWithFilters.filter(movie => {
			const passesMPA = !selectedMPA || movie.mpa_rating === selectedMPA;
			const runtime = movie.runtime !== null ? parseInt(movie.runtime) : null;
			const passesRuntime =
				(runtime !== null) &&
				runtime >= minRuntime &&
				runtime <= maxRuntime;

			return passesMPA && passesRuntime;
		});

		console.log("Filtered Movies:", filteredMovies);
		updateMovieTable(filteredMovies);
	}


	//Update Movie Table
	function updateMovieTable(filteredMovies) {
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

	document.getElementById("apply-filters").addEventListener("click", applyFilters);