document.addEventListener("DOMContentLoaded", function () {
    fetchMovies();
});

// Fetch movies from API
function fetchMovies() {
    fetch("http://localhost:8888/Oscar_Reporting/api/get_movies.php")
        .then(response => response.json())
        .then(data => {
			console.log("Fetched Movie Data:", data); //line to debug
            if (!Array.isArray(data) || data.length === 0) {
                document.getElementById("movies-container").innerHTML = "<tr><td colspan='2'>No movies found.</td></tr>";
                return;
            }
            displayMovies(data);
        })
        .catch(error => {
            console.error("Error fetching movies:", error);
            document.getElementById("movies-container").innerHTML = "<tr><td colspan='2'>Error loading movies.</td></tr>";
        });
}

// Display movies in the table
function displayMovies(movies) {
    const container = document.getElementById("movies-container");
    container.innerHTML = ""; // Clear previous content

    movies.forEach(movie => {
        const row = document.createElement("tr");
        row.classList.add("movie-row");
        row.dataset.movieId = movie.id; // Store the movie ID
        row.innerHTML = `<td class="movie-title" onclick="toggleDetails(${movie.id})">${movie.title}</td>`;

        // Create details row with new options
        const detailsRow = document.createElement("tr");
        detailsRow.classList.add("details-row", "hidden");
        detailsRow.id = `details-${movie.id}`;
        detailsRow.innerHTML = `
            <td colspan="2">
                <div class="details-options">
                    <button class="details-btn" data-movie-id="${movie.id}" data-section="description">Description</button>
                    <button class="details-btn" data-movie-id="${movie.id}" data-section="movie-details">Movie Details</button>
                    <button class="details-btn" data-movie-id="${movie.id}" data-section="cast-crew">Cast & Crew</button>
                    <button class="details-btn" data-movie-id="${movie.id}" data-section="oscars">Oscars</button>
                    <button class="details-btn" data-movie-id="${movie.id}" data-section="analytics">Analytics</button>
                </div>
            </td>
        `;

        container.appendChild(row);
        container.appendChild(detailsRow);
    });
}

// Toggle nested row visibility
function toggleDetails(movieId) {
    const detailsRow = document.getElementById(`details-${movieId}`);
    detailsRow.classList.toggle("hidden");
}

// Open modal and load content dynamically when clicking an option
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("details-btn")) {
        const movieId = event.target.dataset.movieId;
        const section = event.target.dataset.section;
        openModal(movieId, section);
    }
});

// Fetch movie details and populate modal
function openModal(movieId, section) {
    document.getElementById("movie-modal").style.display = "block";

    fetch(`http://localhost:8888/Oscar_Reporting/api/get_movie_details.php?id=${movieId}`)
        .then(response => response.json())
        .then(data => {
            console.log("Fetched Movie Data:", data); // Debugging Line

            if (data.error) {
                console.error("Error:", data.error);
                return;
            }

            // **Populate Header**
            document.getElementById("modal-title").innerText = data.title;
            document.getElementById("modal-poster").src = data.poster || "default-poster.jpg";
            document.getElementById("modal-poster").alt = `Poster of ${data.title}`;

            // **Ensure placeholders always exist**
            document.getElementById("description-content").innerHTML = `<p>${data.description || "No description available."}</p>`;

            document.getElementById("movie-details-content").innerHTML = `
                <p><strong>Release Date:</strong> ${formatDate(data.release_date)}</p>
                <p><strong>MPA Rating:</strong> ${data.mpa_rating || "<span style='color:gray'>Unavailable</span>"}</p>
                <p><strong>Genre:</strong> ${data.genres || "Unknown"}</p>
                <p><strong>Movie Length:</strong> ${data.runtime ? data.runtime + " minutes" : "N/A"}</p>
                <p><strong>Rating:</strong> ${data.average_rating ? `${data.average_rating}/10` : "Not Rated"}</p>
                <p><strong>Box Office Earnings:</strong> ${formatMoney(data.box_office_earnings)}</p>
                <p><strong>Production Company:</strong> ${data.production_company || "Unknown"}</p>
            `;

            document.getElementById("cast-crew-content").innerHTML = `
                <p><strong>Director:</strong> ${data.director || "Unknown"}</p>
                <p><strong>Writer:</strong> ${data.writer || "Unknown"}</p>
                <div class="scrollable">
                    <p><strong>Cast:</strong></p>
                    <ul>${data.cast.length ? data.cast.map(c => `<li>${c}</li>`).join("") : "No Cast Info"}</ul>
                </div>
            `;

            document.getElementById("oscars-content").innerHTML = `
                <h3>Nominated in ${data.oscars.oscar_year} at the ${formatCeremonyNumber(data.oscars.ceremony_number)} Academy Awards</h3>
                <p><strong>Total Nominations:</strong> ${data.oscars.total_nominations}</p>
                <p><strong>Total Wins:</strong> ${data.oscars.total_wins}</p>
                <h4>Nominees:</h4>
                <ul>
                    ${data.oscars.nominees.length
                        ? data.oscars.nominees.map(n => `<li ${n.won ? "style='font-weight:bold'" : ""}>${n.category}: ${n.nominee} ${n.won ? "(Winner)" : ""}</li>`).join("")
                        : "No nominations available."}
                </ul>
            `;

            showTab(section);
        })
        .catch(error => console.error("Error fetching movie details:", error));
}

// Switch tabs in the modal
document.querySelectorAll(".tab-btn").forEach(button => {
    button.addEventListener("click", function () {
        showTab(this.dataset.tab);
    });
});

function showTab(tabName) {
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.remove("active");
    });
    document.getElementById(`${tabName}-content`).classList.add("active");
}

// Close modal
function closeModal() {
    document.getElementById("movie-modal").style.display = "none";
}

// Formatting Helpers
function formatDate(dateString) {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
}

function formatMoney(amount) {
    return amount ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount) : "N/A";
}

function formatCeremonyNumber(number) {
    if (number % 10 === 1 && number !== 11) return number + "st";
    if (number % 10 === 2 && number !== 12) return number + "nd";
    if (number % 10 === 3 && number !== 13) return number + "rd";
    return number + "th";
}

function formatCategory(text) {
    return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}
