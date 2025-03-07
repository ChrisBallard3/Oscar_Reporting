
	import { renderMovieList, allMovies } from "./DataTable.js";

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

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Fetched Box Office Data:", data);

			if (!Array.isArray(data)) {
				throw new Error("Invalid JSON structure received");
			}

			return data.map(item => ({
				movie_id: item.movie_id,
				box_office_earnings: item.box_office_earnings
			}));
		} catch (error) {
			console.error("Error fetching box office earnings:", error);
			return [];
		}
	}

	async function fetchMoviePeople(searchTerm) {
		try {
			const response = await fetch(`http://localhost:8888/Oscar_Reporting/api/movies/get_movie_people.php?name=${encodeURIComponent(searchTerm)}`);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Fetched Movie People Data:", data);

			if (!Array.isArray(data)) {
				throw new Error("Invalid JSON structure received");
			}

			return data.map(person => ({
				movie_id: person.movie_id,
				writers: person.writers || "",
				directors: person.directors || "",
				cast: person.cast || ""
			}));
		} catch (error) {
			console.error("Error fetching movie people:", error);
			return [];
		}
	}

	async function fetchTitles() {
		try {
			const response = await fetch("http://localhost:8888/Oscar_Reporting/api/movies/get_titles.php");
			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Error fetching movie titles:", error);
			return [];
		}
	}

	async function fetchOscarWinners() {
		try {
			const response = await fetch("http://localhost:8888/Oscar_Reporting/api/movies/get_oscar_winners.php");

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Fetched Oscar Winners Data:", data);

			if (!Array.isArray(data)) {
				throw new Error("Invalid JSON structure received");
			}

			return data.map(item => ({
				movie_id: item.movie_id,
				title: item.title,
				total_wins: item.total_wins
			}));
		} catch (error) {
			console.error("Error fetching Oscar winners:", error);
			return [];
		}
	}

	async function fetchOscarWins() {
		try {
			const response = await fetch("http://localhost:8888/Oscar_Reporting/api/movies/get_oscar_winners.php");

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Fetched Oscar Wins Data:", data);

			if (!Array.isArray(data)) {
				throw new Error("Invalid JSON structure received");
			}

			return data.map(item => ({
				movie_id: item.movie_id,
				total_wins: item.total_wins
			}));
		} catch (error) {
			console.error("Error fetching Oscar wins:", error);
			return [];
		}
	}

	document.addEventListener("DOMContentLoaded", async () => {
		const oscarSlider = document.getElementById("filter-oscar-slider");
		const oscarSliderValue = document.getElementById("oscar-slider-value");

		if (!oscarSlider || !oscarSliderValue) {
			console.error("Oscar slider input not found!");
			return;
		}

		oscarSlider.addEventListener("input", () => {
			oscarSliderValue.textContent = oscarSlider.value;
		});
	});

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
					${movie.title}${matchedNames.length > 0 ? ` - ${matchedNames.join(" | ")}` : ""}
				</td>
			`;

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

	export async function applyFilters() {
		console.log("Apply Filters Clicked!");

		const searchName = document.getElementById("filter-person")?.value.trim().toLowerCase() || "";
		const selectedMPA = document.getElementById("mpa-filter")?.value;
		const minRuntime = parseInt(document.getElementById("filter-runtime-min")?.value) || 0;
		const maxRuntime = parseInt(document.getElementById("filter-runtime-max")?.value) || Infinity;
		const oscarCheckbox = document.getElementById("filter-oscar-winner")?.checked || false;
		const oscarSliderValue = parseInt(document.getElementById("filter-oscar-slider")?.value) || 0;

		const [runtimeData, mpaData, peopleData, oscarData] = await Promise.all([
			fetchMovieRuntimes(),
			fetchMPARatings(),
			searchName ? fetchMoviePeople(searchName) : Promise.resolve([]), 
			fetchOscarWins()
		]);

		console.log("Fetched People Data:", peopleData);
		console.log("Fetched Oscar Data:", oscarData);

		const moviesWithFilters = allMovies.map(movie => {
			const mpaInfo = mpaData.find(mpa => mpa.movie_id === movie.id);
			const runtimeInfo = runtimeData.find(runtime => runtime.movie_id === movie.id);
			const matchingPeople = peopleData.find(person => person.movie_id === movie.id) || {};
			const oscarInfo = oscarData.find(oscar => oscar.movie_id === movie.id);

			return {
				...movie,
				mpa_rating: mpaInfo ? mpaInfo.mpa_rating : null,
				runtime: runtimeInfo ? runtimeInfo.runtime : null,
				writers: matchingPeople.writers || "",
				directors: matchingPeople.directors || "",
				cast: matchingPeople.cast || "",
				total_wins: oscarInfo ? oscarInfo.total_wins : 0
			};
		});

		console.log("Movies with Filters Applied:", moviesWithFilters);

		const filteredMovies = moviesWithFilters.filter(movie => {
			const passesMPA = !selectedMPA || movie.mpa_rating === selectedMPA;
			const runtime = movie.runtime !== null ? parseInt(movie.runtime) : null;
			const passesRuntime = runtime !== null && runtime >= minRuntime && runtime <= maxRuntime;

			const passesPeople = !searchName || 
				(movie.writers && movie.writers.toLowerCase().includes(searchName)) ||
				(movie.directors && movie.directors.toLowerCase().includes(searchName)) ||
				(movie.cast && movie.cast.toLowerCase().includes(searchName));

			const passesOscarFilter = !oscarCheckbox || (movie.total_wins > 0);

			const passesOscarSlider = movie.total_wins >= oscarSliderValue;

			return passesMPA && passesRuntime && passesPeople && passesOscarFilter && passesOscarSlider;
		});

		console.log("Filtered Movies:", filteredMovies);
		updateDataTable(filteredMovies);
	}

	document.getElementById("apply-filters").addEventListener("click", applyFilters);