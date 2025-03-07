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
		<main class="container">
			<h1>Academy Award Movie Database</h1>

		<!--Filter Fields-->
			<div class="filter-box">
			<!--Row One-->
				<section class="filter-row">
				<!--Oscars Won-->
					<section class="filter-field">
						<label class="filter-label" for="filter-oscar-slider">Minimum Oscars Won</label>

						<input type="range" id="filter-oscar-slider" min="0" max="11" value="0" step="1">
						
						<span id="oscar-slider-value">0</span>
					</section>

				<!--Movie Length-->
					<section class="filter-field">
						<label class="filter-label">Movie Length (In Minutes)</label>

						<div class="range">
							<input class="filter-input" type="number" id="filter-runtime-min" placeholder="Min">
							<input class="filter-input" type="number" id="filter-runtime-max" placeholder="Max">
						</div>
					</section>

				<!--Box Office Earnings-->
					<section class="filter-field">
						<label class="filter-label">Box Office Earnings</label>

						<div class="range">
							<input class="filter-input" type="number" id="filter-box-office-min" placeholder="Min">
							<span>-</span>
							<input class="filter-input" type="number" id="filter-box-office-max" placeholder="Max">
						</div>
					</section>

				<!--Average Rating-->
					<section class="filter-field">
						<label class="filter-label">Average Rating (0-10)</label>

						<div class="range">
							<input class="filter-input" type="number" id="filter-rating-min" placeholder="Min" step="0.1" min="0" max="10">
							<input class="filter-input" type="number" id="filter-rating-max" placeholder="Max" step="0.1" min="0" max="10">
						</div>
					</section>
				</section>

			<!--Row Two-->
				<section class="filter-row">
				<!--Won an Oscar-->
					<section class="filter-field">
						<label class="filter-label" for="filter-oscar-winner">
							<input type="checkbox" id="filter-oscar-winner"> Oscar Winner
						</label>
					</section>

				<!--Movie Titles-->
					<section class="filter-field">
						<label class="filter-label" for="filter-title">Search Movies</label>

						<input class="filter-input" type="text" id="filter-title" placeholder="Search Movies">
					</section>
				
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

				<!--Movie Workers-->
					<section class="filter-field">
						<label class="filter-label" for="filter-person">Search People (Writers/Directors/Cast):</label>

						<input class="filter-input" type="text" id="filter-person" placeholder="Enter a name">
					</section>
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
					<div id="description-content" class="tab-content container-description active"></div>
					<div id="movie-details-content" class="tab-content container-movie-details"></div>
					<div id="cast-crew-content" class="tab-content container-cast-crew"></div>
					<div id="oscars-content" class="tab-content container-oscars"></div>
					<div id="analytics-content" class="tab-content container-analytics"></div>
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
