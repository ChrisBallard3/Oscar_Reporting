<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Academy Award Movie Database</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <h1>Click one of the Best Picture Nominees to theme the page like the film.</h1>

    <div class="button-container">
        <button class="un-button-theme">A Complete Unknown</button>
        <button class="anor-button-theme">Anora</button>
        <button class="brut-button-theme">The Brutalist</button>
        <button class="con-button-theme">Conclave</button>
        <button class="dune-button-theme">Dune: Part 2</button>
        <button class="emil-button-theme">Emilia Perez</button>
        <button class="stil-button-theme">I'm Still Here</button>
        <button class="nick-button-theme">Nickel Boys</button>
        <button class="sub-button-theme">The Substance</button>
        <button class="wick-button-theme">Wicked</button>
    </div>

	<div class="container">
        <h1>Academy Award Movie Database</h1>
        <input type="text" id="search" placeholder="Search for a movie..." onkeyup="searchMovies()">
        
        <table id="movies-table">
            <tbody id="movies-container">
                <tr><td colspan="2">Loading movies...</td></tr>
            </tbody>
        </table>
    </div>

    <!-- Movie Details Modal -->
<div id="movie-modal" class="modal">
    <div class="modal-content">
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <h2 id="modal-title"></h2>
        <img id="modal-poster" src="" alt="Movie Poster">

        <!-- Tab Navigation -->
        <div class="modal-tabs">
            <button class="tab-btn active" data-tab="description">Description</button>
            <button class="tab-btn" data-tab="movie-details">Movie Details</button>
            <button class="tab-btn" data-tab="cast-crew">Cast & Crew</button>
            <button class="tab-btn" data-tab="oscars">Oscars</button>
            <button class="tab-btn" data-tab="analytics">Analytics</button>
        </div>

        <!-- Tab Content -->
        <div class="modal-body">
            <div id="description-content" class="tab-content active"></div>
            <div id="movie-details-content" class="tab-content"></div>
            <div id="cast-crew-content" class="tab-content"></div>
            <div id="oscars-content" class="tab-content"></div>
            <div id="analytics-content" class="tab-content"></div>
        </div>
    </div>
</div>

<!-- Oscar Category Modal (Opens when clicking a category in Oscars tab) -->
<div id="category-modal" class="modal">
    <div class="modal-content">
        <span class="close-btn" onclick="closeCategoryModal()">&times;</span>
        <h2 id="category-modal-title"></h2>
        <div id="category-modal-content"></div>
    </div>
</div>

    <script src="js/script.js"></script>
</body>
</html>
