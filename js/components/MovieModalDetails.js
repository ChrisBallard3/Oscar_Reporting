
	import { openModal, showTab } from "./MovieModalFunctions.js";
	import { fetchFullMovie } from "../api/MoviesAPI.js";
	import { formatDate, formatMoney } from "../utils/formatting.js";
	import { openOscarModal } from "./OscarDetailsModal.js";


	//Load Data into Movie Modal
		export async function loadMovieIntoModal(movieId, section = "description") {
			openModal();

		//Fetch Movie Data
			const movieData = await fetchFullMovie(movieId);
			if (!movieData) {
				console.error("Movie data is missing.");
				return;
			}

		//Populate modal content
			document.getElementById("modal-title").innerText = movieData.title || "Unknown Title";
			document.getElementById("modal-poster").src = movieData.poster || "https://via.placeholder.com/120x180?text=No+Image";

		//Populate "Description" Tab
			document.getElementById("description-content").innerHTML = `<p>${movieData.description || "No description available."}</p>`;

		//Populate "Movie Details" Tab
			document.getElementById("movie-details-content").innerHTML = `
				<p><strong>Release Date:</strong> ${formatDate(movieData.release_date)}</p>
				<p><strong>MPA Rating:</strong> ${movieData.mpa_rating || "Unavailable"}</p>
				<p><strong>Genre:</strong> ${movieData.genres || "Unknown"}</p>
				<p><strong>Runtime:</strong> ${movieData.runtime ? `${movieData.runtime} minutes` : "N/A"}</p>
				<p><strong>Box Office:</strong> ${formatMoney(movieData.box_office_earnings)}</p>
			`;

		//Convert cast array into a list
			const castList = Array.isArray(movieData.cast) ? movieData.cast.map(c => `<li>${c}</li>`).join("") : "No Cast Info";

		//Populate "Cast & Crew" Tab
			document.getElementById("cast-crew-content").innerHTML = `
				<div class="flex">
					<d><strong>Directors:</strong> ${movieData.directors || "Unknown"}</d>
					<w><strong>Writers:</strong> ${movieData.writers || "Unknown"}</w>
				</div>

				<div class="oscar-cast">
					<c><strong><u>List of Cast Members</u></strong></c>
				</div>

				<div class="scrollable">
					<ul>${castList}</ul>
				</div>
			`;

		//Populate "Oscars" Tab
			document.getElementById("oscars-content").innerHTML = `
				<div class="oscars-header">
					<h2>The ${movieData.oscars?.ceremony_number || "N/A"} Academy Awards</h2>
					<h2>Nomination Year: ${movieData.oscars?.oscar_year || "N/A"}</h2>
				</div>

				<div class="oscars-body">
					<div class="oscars-left">
						<h3><strong>Total Nominations:</strong> ${movieData.oscars?.total_nominations || 0}</h3>
						<h3><strong>Total Wins:</strong> ${movieData.oscars?.total_wins || 0}</h3>
						<h3><strong>Oscar Win Percentage:</strong> ${movieData.analytics.win_percentage || "N/A"}</h3>
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
					oscarButton.addEventListener("click", () => openOscarModal(movieId));
				} else {
					console.error("Oscar modal button not found!");
				}
			}, 200);

		//Populate "Analytics" Tab
			document.getElementById("analytics-content").innerHTML = `
				<div class="analytics-main">
					<div class="analytics-section">
						<h3>Comparison to other Academy Award Nominated Films</h3>

						<div class="analytics-row">
							<p><u>Overall Ranking</u>: <strong>${movieData.analytics.overall_ranking || "N/A"}</strong> out of <strong>${movieData.analytics.overall_amount || "N/A"}</strong></p>
							<p><u>From the film's decade (${movieData.release_date ? new Date(movieData.release_date).getFullYear().toString().slice(0, 3) + "0s" : "Unknown"})</u>: <strong>${movieData.analytics.decade_ranking || "N/A"}</strong> out of <strong>${movieData.analytics.decade_amount || "N/A"}</strong></p>
							<p><u>From the film's year (${movieData.release_date ? new Date(movieData.release_date).getFullYear() : "Unknown"})</u>: <strong>${movieData.analytics.year_ranking || "N/A"}</strong> out of <strong>${movieData.analytics.year_amount || "N/A"}</strong></p>
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

	//Handles Clicking from one Tab to another
		document.addEventListener("click", function (event) {
			if (event.target.classList.contains("tab-btn")) {
				showTab(event.target.dataset.tab);
			}
		});

	//Handles the Close Button
		document.addEventListener("DOMContentLoaded", () => {
			const closeModalBtn = document.getElementById("close-modal-btn");
			if (closeModalBtn) {
				closeModalBtn.addEventListener("click", closeModal);
			} else {
				console.error("Close modal button not found.");
			}
		});