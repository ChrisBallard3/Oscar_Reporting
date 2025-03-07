import { displayMovies } from "./components/DataTable.js";
import { applyFilters } from "./components/MovieFilter.js";
import "./components/OscarModal.js";
import { loadMovieModal } from "./components/MovieModal.js";


document.addEventListener("DOMContentLoaded", function () {
    displayMovies();

    document.getElementById("apply-filters").addEventListener("click", () => {
        console.log("Apply Filters Clicked!");
        applyFilters();
    });
});
