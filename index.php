<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Academy Award Movie Database</title>
    <link rel="stylesheet" href="css/styles.css">
	<script type="module" src="js/App.js"></script>
</head>
<body>
    <h1>Click one of the Best Picture Nominees to theme the page like the film.</h1>

    <div class="theme-button-container">
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

<!--Movie Modal-->
<div id="movie-modal" class="modal-background">
    <main id="movie-modal-content">
	<!--Header-->
        <section id="container-movie-modal-header">
		<!--Tabs-->
			<section class="container-movie-modal-tabs">
                <button class="tab-btn active" data-tab="description">Description</button>
                <button class="tab-btn" data-tab="movie-details">Movie Details</button>
                <button class="tab-btn" data-tab="cast-crew">Cast & Crew</button>
                <button class="tab-btn" data-tab="oscars">Oscars</button>
                <button class="tab-btn" data-tab="analytics">Analytics</button>
            </section>

		<!--Movie Title-->
            <section id="container-movie-modal-title">
                <div id="modal-title" class="movie-modal-title">Movie Title</div>
            </section>

        <!--Poster-->
            <section id="container-movie-modal-poster">
                <img id="modal-poster" class="movie-modal-poster" src="" alt="Movie Poster">
            </section>

		<!--X Button-->
            <section id="container-movie-modal-x">
				<span id="close-modal-btn" class="button-close-x">&times;</span>
			</section>
        </section>

	<!--Details-->
		<section id="container-movie-modal-details">
			<div id="description-content" class="tab-content container-description active"></div>
			<div id="movie-details-content" class="tab-content container-movie-details"></div>
			<div id="cast-crew-content" class="tab-content container-cast-crew"></div>
			<div id="oscars-content" class="tab-content container-oscars"></div>
			<div id="analytics-content" class="tab-content container-analytics"></div>
		</section>
    </main>
</div>


<!-- Oscar Category Modal (Opens when clicking a category in Oscars tab) -->
<div id="oscar-modal" class="modal-background">
    <main id="oscar-modal-content">
        <section id="container-oscar-modal-header">
            <section id="oscar-modal-header-title"></section>
            <section id="container-movie-modal-x">
                <span id="close-oscar-modal-btn" class="button-close-x">&times;</span>
            </section>
        </section>
        <section class="oscar-scroll-box"">
            <div id="oscar-modal-body"></div> 
        </section>
    </main>
</div>


    <script src="js/script.js"></script>
</body>
</html>
