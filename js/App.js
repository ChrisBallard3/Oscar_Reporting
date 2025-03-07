import { displayMovies } from "./components/DataTable.js";
import { applyFilters } from "./components/MovieFilter.js";
import "./components/OscarModal.js";
import "./components/themes/ThemeSettings.js";
import { loadMovieModal } from "./components/MovieModal.js";


document.addEventListener("DOMContentLoaded", function () {
    displayMovies(); // ✅ Load movies on page load

    document.getElementById("apply-filters").addEventListener("click", () => {
        console.log("Apply Filters Clicked!"); // ✅ Debugging Step
        applyFilters();
    });
});
