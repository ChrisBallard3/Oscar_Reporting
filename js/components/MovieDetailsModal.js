
	import { fetchFullMovie } from "../api/MoviesAPI.js";
	import { formatDate, formatMoney } from "../utils/formatting.js";
	import { openOscarModal } from "./OscarDetailsModal.js";


	export async function openModal(movieId, section = "description") {
		document.getElementById("movie-modal").style.display = "block";

		//Reset tab state
		document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
		document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

		const movieData = await fetchFullMovie(movieId);
		if (!movieData) {
			console.error("Movie data is missing.");
			return;
		}

		//Defaults
		const title = movieData.title || "Unknown Title";
		const poster = movieData.poster || "https://via.placeholder.com/120x180?text=No+Image";
		const description = movieData.description || "No description available.";
		const genres = movieData.genres || "Unknown";
		const rating = movieData.average_rating ? `${movieData.average_rating}/10` : "Not Rated";
		const castList = Array.isArray(movieData.cast) ? movieData.cast.map(c => `<li>${c}</li>`).join("") : "No Cast Info";

		//Set Title/Poster
		document.getElementById("modal-title").innerText = title;
		document.getElementById("modal-poster").src = poster;

		//Populate Tab Data
		document.getElementById("description-content").innerHTML = `<p>${description}</p>`;

		document.getElementById("movie-details-content").innerHTML = `
			<p><strong>Release Date:</strong> ${formatDate(movieData.release_date)}</p>
			<p><strong>MPA Rating:</strong> ${movieData.mpa_rating || "Unavailable"}</p>
			<p><strong>Genre:</strong> ${genres}</p>
			<p><strong>Movie Length:</strong> ${movieData.runtime ? `${movieData.runtime} minutes` : "N/A"}</p>
			<p><strong>Box Office Earnings:</strong> ${formatMoney(movieData.box_office_earnings)}</p>
		`;

		document.getElementById("cast-crew-content").innerHTML = `
			<div class="flex">
				<d><strong>Director:</strong> ${movieData.director || "Unknown"}</d>
				<w><strong>Writer:</strong> ${movieData.writer || "Unknown"}</w>
			</div>

			<div class="oscar-cast">
				<c><strong><u>List of Cast Members</u></strong></c>
			</div>

			<div class="scrollable">
				<ul>${castList}</ul>
			</div>
		`;

		document.getElementById("oscars-content").innerHTML = `
			<div class="oscars-header">
				<h2>The ${movieData.oscars?.ceremony_number || "N/A"} Academy Awards</h2>
				<h2>Nomination Year: ${movieData.oscars?.oscar_year || "N/A"}</h2>
			</div>

			<div class="oscars-body">
				<div class="oscars-left">
					<h3><strong>Total Nominations:</strong> ${movieData.oscars?.total_nominations || 0}</h3>
					<h3><strong>Total Wins:</strong> ${movieData.oscars?.total_wins || 0}</h3>
					<h3><strong>Oscar Win Percentage:</strong> ${movieData.analytics.win_percentage}</h3>
				</div>

				<div class="oscars-right">
					<h3><strong><u>Nominated Categories</u></strong></h3>
					<button id="open-oscar-modal" class="oscar-modal-button" data-movie-id="${movieId}">Category Information</button>
				</div>
			</div>
		`;

		setTimeout(() => {
			const oscarButton = document.getElementById("open-oscar-modal");
			if (oscarButton) {
				oscarButton.removeEventListener("click", openOscarModal);
				oscarButton.addEventListener("click", function () {
					console.log("Category Info button clicked!");
					openOscarModal(movieId);
				});
			} else {
				console.error("Oscar modal button not found!");
			}
		}, 200);

		document.getElementById("analytics-content").innerHTML = `
			<div class="analytics-main">
				<div class="analytics-section">
					<h3>Comparison to other Academy Award Nominated Films</h3>

					<div class="analytics-row">
						<p><u>Overall Ranking</u>: <strong>${movieData.analytics.overall_ranking}</strong> out of <strong>${movieData.analytics.overall_amount}</strong></p>
						<p><u>From the film's decade (${movieData.release_date ? new Date(movieData.release_date).getFullYear().toString().slice(0, 3) + "0s" : "Unknown"})</u>: <strong>${movieData.analytics.decade_ranking}</strong> out of <strong>${movieData.analytics.decade_amount}</strong></p>
						<p><u>From the film's year (${movieData.release_date ? new Date(movieData.release_date).getFullYear() : "Unknown"})</u>: <strong>${movieData.analytics.year_ranking}</strong> out of <strong>${movieData.analytics.year_amount}</strong></p>
					</div>
				</div>

				<div class="analytics-section">
					<h3>Film & Historical Ratings</h3>

					<div class="analytics-row">
						<p><u>This film’s rating</u>: <strong>${movieData.average_rating || "Not Rated"}</strong> out of <strong>$10</strong></p>
						<p><u>Average nominee rating for this film’s year (${movieData.release_date ? new Date(movieData.release_date).getFullYear() : "Unknown"})</u>: <strong>${movieData.analytics.average_year_rating}</strong> out of <strong>$10</strong></p>
						<p><u>Average nominee rating for this film’s decade (${movieData.release_date ? new Date(movieData.release_date).getFullYear().toString().slice(0, 3) + "0s" : "Unknown"})</u>: <strong>${movieData.analytics.average_decade_rating}</strong> out of <strong>$10</strong></p>
					</div>
				</div>
			</div>
		`;

		showTab(section);
	}

	function showTab(tabName) {
		document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
		document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

		document.getElementById(`${tabName}-content`).classList.add("active");
		document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add("active");
	}

	document.addEventListener("click", function (event) {
		if (event.target.classList.contains("tab-btn")) {
			showTab(event.target.dataset.tab);
		}
	});

	export function closeModal() {
		document.getElementById("movie-modal").style.display = "none";
	}

	//Close modal when click outside of it
	document.addEventListener("click", function (event) {
		const movieModal = document.getElementById("movie-modal");

		if (event.target === movieModal) {
			closeModal();
		}
	});

	document.getElementById("close-modal-btn").addEventListener("click", closeModal);

	const closeModalBtn = document.getElementById("close-modal-btn");
	if (closeModalBtn) {
		closeModalBtn.addEventListener("click", closeModal);
	} else {
		console.error("close-modal-btn not found in DOM.");
	}



