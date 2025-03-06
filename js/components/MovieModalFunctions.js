
//Open Modal
	export function openModal() {
		const modal = document.getElementById("movie-modal");
		if (!modal) {
			console.error("Movie modal element not found!");
			return;
		}
		modal.style.display = "block";
	}

//Close Modal
	export function closeModal() {
		const modal = document.getElementById("movie-modal");
		if (modal) {
			modal.style.display = "none";
		} else {
			console.error("Movie modal not found.");
		}
	}

//Tab Switching
	export function showTab(tabName) {
		document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
		document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));

		document.getElementById(`${tabName}-content`).classList.add("active");
		document.querySelector(`.tab-btn[data-tab="${tabName}"]`).classList.add("active");
	}

//Attach event listener for tab clicks
	document.addEventListener("click", function (event) {
		if (event.target.classList.contains("tab-btn")) {
			showTab(event.target.dataset.tab);
		}
	});

//Close modal when clicking outside
	document.addEventListener("click", function (event) {
		const modal = document.getElementById("movie-modal");
		if (event.target === modal) {
			closeModal();
		}
	});

//Close modal when clicking "X" button
	document.addEventListener("DOMContentLoaded", () => {
		const closeModalBtn = document.getElementById("close-modal-btn");
		if (closeModalBtn) {
			closeModalBtn.addEventListener("click", closeModal);
		} else {
			console.error("Close modal button not found.");
		}
	});