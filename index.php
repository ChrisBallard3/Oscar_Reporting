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
		<!--Button Toggles Theme Selection-->
		<button id="style-toggle-btn">Click Here to Change the Style</button>

		<!--Initially Hidden Theme Section-->
		<div id="theme-section">
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
		</div>

		<main class="container">
			<h1>Academy Award Movie Database</h1>





		<!--Filter Fields-->
			<div class="filter-box">
			<!--Row One-->
				<section class="filter-row">
				<!--MPA Rating-->
					<section class="filter-field">
						<label class="filter-label" for="mpa-filter">MPA Rating:</label>

						<select class="filter-select" id="mpa-filter">
							<option value="">All</option>
							<option value="G">G</option>
							<option value="PG">PG</option>
							<option value="PG-13">PG-13</option>
							<option value="R">R</option>
							<option value="NC-17">NC-17</option>
						</select>
					</section>

				<!--Movie Length-->
					<section class="filter-field">
						<label class="filter-label">Movie Length</label>

						<div class="range">
							<input class="filter-input" type="number" id="filter-runtime-min" placeholder="Minutes: Min">
							<input class="filter-input" type="number" id="filter-runtime-max" placeholder="Minutes: Max">
						</div>
					</section>
				</section>

			<!--Row Two-->
				<section class="filter-row">
				<!--Box Office Earnings-->
					<section class="filter-field">
						<label class="filter-label">Box Office Earnings</label>

						<div class="range">
							<input class="filter-input" type="number" id="filter-box-office-min" placeholder="Min Earnings">
							<span>-</span>
							<input class="filter-input" type="number" id="filter-box-office-max" placeholder="Max Earnings">
						</div>
					</section>

				<!--Average Rating-->
					<section class="filter-field">
						<label class="filter-label">Average Rating</label>

						<div class="range">
							<input class="filter-input" type="number" id="filter-rating-min" placeholder="Min Rating (0-10)" step="0.1" min="0" max="10">
							<input class="filter-input" type="number" id="filter-rating-max" placeholder="Max Rating (0-10)" step="0.1" min="0" max="10">
						</div>
					</section>
				</section>

			<!--Row Three-->
			<section class="filter-row">
					<!--Movie Workers-->
					<section class="filter-field">
						<label class="filter-label" for="filter-person">Search People (Writers, Directors, Cast):</label>

						<input class="filter-input" type="text" id="filter-person" placeholder="Enter a name">
					</section>


				<!--Directors-->
					<!--<section class="filter-field">
						<label class="filter-label">Average Rating</label>

						<div class="range">
							<input class="filter-input" type="number" id="filter-rating-min" placeholder="Min Rating (0-10)" step="0.1" min="0" max="10">
							<input class="filter-input" type="number" id="filter-rating-max" placeholder="Max Rating (0-10)" step="0.1" min="0" max="10">
						</div>
					</section>-->

				</section>
				

			<!--Filter Button-->
				<section class="filter">
					<button class="filter-button" id="apply-filters">Apply Filters</button>
				</section>
			</div>








			<table id="movies-table">
				<tbody id="movies-container">
					<tr><td colspan="2">Loading movies...</td></tr>
				</tbody>
			</table>
		</main>

	<!--Movie Modal-->
		<div id="movie-modal" class="modal-background">
			<div id="movie-modal-content">
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
					<nav id="description-content" class="tab-content container-description active"></nav>
					<nav id="movie-details-content" class="tab-content container-movie-details"></nav>
					<nav id="cast-crew-content" class="tab-content container-cast-crew"></nav>
					<nav id="oscars-content" class="tab-content container-oscars"></nav>
					<nav id="analytics-content" class="tab-content container-analytics"></nav>
				</section>
			</div>
		</div>


	<!--Oscar Modal | Opens From Oscar Tab in Movie Modal-->
		<div id="oscar-modal" class="modal-background">
			<div id="oscar-modal-content">
				<section id="container-oscar-modal-header">
					<section id="oscar-modal-header-title"></section>

					<section id="container-movie-modal-x">
						<span id="close-oscar-modal-btn" class="button-close-x">&times;</span>
					</section>
				</section>

				<section class="oscar-scroll-box"">
					<div id="oscar-modal-body"></div> 
				</section>
			</div>
		</div>
	</body>

	</html>
