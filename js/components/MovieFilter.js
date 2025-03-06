
	import { renderMovieList, allMovies } from "./MovieTable.js";

	export let lastFilteredMovies = [];

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

	async function fetchAverageRatings() {
		try {
			const response = await fetch("http://localhost:8888/Oscar_Reporting/api/movies/get_average_ratings.php");
			return await response.json();
		} catch (error) {
			console.error("Error fetching average ratings:", error);
			return [];
		}
	}

	async function fetchBoxOfficeEarnings() {
		try {
			const response = await fetch("http://localhost:8888/Oscar_Reporting/api/movies/get_box_office.php");
			return await response.json();
		} catch (error) {
			console.error("Error fetching box office earnings:", error);
			return [];
		}
	}

	async function fetchMoviePeople(searchTerm) {
		try {
			const response = await fetch(`http://localhost:8888/Oscar_Reporting/api/movies/get_movie_people.php?name=${encodeURIComponent(searchTerm)}`);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Error fetching movie people:", error);
			return [];
		}
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
					${movie.title}${matchedNames.length > 0 ? ` - ${matchedNames.join(" | ")}` : ""}
				</td>
			`;

			container.appendChild(row);
		});
	}

	export async function applyFilters() {
		console.log("Apply Filters Clicked!");
	
		const searchName = document.getElementById("filter-person")?.value.trim() || "";
		const selectedMPA = document.getElementById("mpa-filter")?.value;
		const minRuntime = parseInt(document.getElementById("filter-runtime-min")?.value) || 0;
		const maxRuntime = parseInt(document.getElementById("filter-runtime-max")?.value) || Infinity;
	
		const [runtimeData, mpaData, peopleData] = await Promise.all([
			fetchMovieRuntimes(),
			fetchMPARatings(),
			searchName ? fetchMoviePeople(searchName) : Promise.resolve([])
		]);
	
		console.log("Fetched People Data:", peopleData);
	
		const moviesWithFilters = allMovies.map(movie => {
			const mpaInfo = mpaData.find(mpa => mpa.id === movie.id);
			const runtimeInfo = runtimeData.find(runtime => runtime.id === movie.id);
			const peopleInfo = peopleData.find(person => person.id === movie.id);

			return {
				...movie,
				mpa_rating: mpaInfo ? mpaInfo.mpa_rating : null,
				runtime: runtimeInfo ? runtimeInfo.runtime : null,
				writers: peopleInfo?.writers || "",
				directors: peopleInfo?.directors || "",
				cast: peopleInfo?.cast || ""
			};
		});

		lastFilteredMovies = moviesWithFilters;

		const filteredMovies = moviesWithFilters.filter(movie => {
			const passesMPA = !selectedMPA || movie.mpa_rating === selectedMPA;
			const runtime = movie.runtime !== null ? parseInt(movie.runtime) : null;
			const passesRuntime = runtime !== null && runtime >= minRuntime && runtime <= maxRuntime;
			const passesPeople = searchName ? peopleData.some(person => person.id === movie.id) : true;

			return passesMPA && passesRuntime && passesPeople;
		});

		console.log("Filtered Movies:", filteredMovies);
		updateMovieTable(filteredMovies);
	}

	document.getElementById("apply-filters").addEventListener("click", applyFilters);