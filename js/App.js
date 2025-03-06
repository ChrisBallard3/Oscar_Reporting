import { displayMovies } from "./components/MovieTable.js";
import { applyFilters } from "./components/MovieFilter.js";
import "./components/OscarDetailsModal.js";
import "./components/themes/ThemeSettings.js";


document.addEventListener("DOMContentLoaded", function () {
    displayMovies(); // ✅ Load movies on page load

    document.getElementById("apply-filters").addEventListener("click", () => {
        console.log("Apply Filters Clicked!"); // ✅ Debugging Step
        applyFilters();
    });
});
