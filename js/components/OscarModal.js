
	import { fetchOscarCategory } from "../api/MoviesAPI.js";


	export async function openOscarModal(movieId) {
		console.log("openOscarModal function triggered!"); 

		setTimeout(() => {
			const modal = document.getElementById("oscar-modal");
			if (!modal) {
				console.error("Oscar modal not found in DOM!");
				return;
			}

			modal.style.display = "block"; 

			fetchOscarCategory(movieId)
				.then(oscarData => {
					console.log("Fetched Oscar Data:", oscarData); 

					if (!oscarData || oscarData.length === 0) {
						document.getElementById("oscar-modal-body").innerHTML = "<p>No Oscar data available for this movie.</p>";
						return;
					}

					document.getElementById("oscar-modal-header-title").innerHTML = `
						<div id="oscar-modal-title" class="oscar-modal-title">Oscar Category Details</div>
						<div class="oscar-category-header">The ${oscarData[0].ceremony_number} Academy Awards (${oscarData[0].oscar_year})</div>
					`;

					let oscarHTML = oscarData.map(category => `
						<div class="oscar-category-group">
							<h3>${formatCategory(category.category)}</h3>
							<ul class="oscar-nominees">
								${category.nominees.map(n => 
									`<li ${n.win ? "class='winner'" : ""}>${n.nominee} ${n.win ? "(Winner)" : ""}</li>`
								).join("")}
							</ul>
						</div>
					`).join("");

					document.getElementById("oscar-modal-body").innerHTML = oscarHTML;
				})
				.catch(error => console.error("Error fetching Oscar details:", error));
		}, 100);
	}

	//Close modal function
	export function closeOscarModal() {
		document.getElementById("oscar-modal").style.display = "none";
	}
	document.addEventListener("click", function (event) {
		const oscarModal = document.getElementById("oscar-modal");

		if (event.target === oscarModal) {
			closeOscarModal();
		}
	});

	document.addEventListener("DOMContentLoaded", () => {
		const closeModalBtn = document.getElementById("close-oscar-modal-btn");
		if (closeModalBtn) {
			closeModalBtn.addEventListener("click", closeOscarModal);
		} else {
			console.error("close-oscar-modal-btn not found in DOM.");
		}
	});

	function formatCategory(text) {
		return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
	}
