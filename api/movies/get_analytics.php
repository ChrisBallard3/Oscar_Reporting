<?php

	require __DIR__ . '/../../database/config.php';

	$movieId = $_GET['id'] ?? null;
	if (!$movieId) {
		die(json_encode(["error" => "No movie ID provided"]));
	}

	// **Fetch Overall Rankings**
	$query = "SELECT COUNT(DISTINCT movie_id) FROM user_ratings";
	$stmt = $pdo->prepare($query);
	$stmt->execute();
	$totalMovies = $stmt->fetchColumn() ?: 0;

	$query = "SELECT movie_id, AVG(average_rating) as avg_rating
			FROM user_ratings
			GROUP BY movie_id
			ORDER BY avg_rating DESC";
	$stmt = $pdo->prepare($query);
	$stmt->execute();
	$rankedMovies = $stmt->fetchAll(PDO::FETCH_ASSOC);

	$overallRanking = array_search($movieId, array_column($rankedMovies, 'movie_id')) + 1;

	// **Fetch Release Year & Decade**
	$query = "SELECT release_date FROM movie_details WHERE movie_id = ?";
	$stmt = $pdo->prepare($query);
	$stmt->execute([$movieId]);
	$releaseDate = $stmt->fetchColumn();
	$releaseYear = date("Y", strtotime($releaseDate));
	$decade = floor($releaseYear / 10) * 10;

	// **Fetch Decade Rankings**
	$query = "SELECT COUNT(DISTINCT movies.id) 
			FROM movies 
			JOIN movie_details ON movies.id = movie_details.movie_id 
			WHERE YEAR(movie_details.release_date) BETWEEN ? AND ?";
	$stmt = $pdo->prepare($query);
	$stmt->execute([$decade, $decade + 9]);
	$totalDecadeMovies = $stmt->fetchColumn() ?: 0;

	$query = "SELECT movies.id, AVG(user_ratings.average_rating) as avg_rating
			FROM movies
			JOIN user_ratings ON movies.id = user_ratings.movie_id
			JOIN movie_details ON movies.id = movie_details.movie_id
			WHERE YEAR(movie_details.release_date) BETWEEN ? AND ?
			GROUP BY movies.id
			ORDER BY avg_rating DESC";
	$stmt = $pdo->prepare($query);
	$stmt->execute([$decade, $decade + 9]);
	$rankedDecadeMovies = $stmt->fetchAll(PDO::FETCH_ASSOC);

	$decadeRanking = array_search($movieId, array_column($rankedDecadeMovies, 'id')) + 1;

	// **Fetch Year Rankings**
	$query = "SELECT COUNT(DISTINCT movies.id) 
			FROM movies 
			JOIN movie_details ON movies.id = movie_details.movie_id 
			WHERE YEAR(movie_details.release_date) = ?";
	$stmt = $pdo->prepare($query);
	$stmt->execute([$releaseYear]);
	$totalYearMovies = $stmt->fetchColumn() ?: 0;

	$query = "SELECT movies.id, AVG(user_ratings.average_rating) as avg_rating
			FROM movies
			JOIN user_ratings ON movies.id = user_ratings.movie_id
			JOIN movie_details ON movies.id = movie_details.movie_id
			WHERE YEAR(movie_details.release_date) = ?
			GROUP BY movies.id
			ORDER BY avg_rating DESC";
	$stmt = $pdo->prepare($query);
	$stmt->execute([$releaseYear]);
	$rankedYearMovies = $stmt->fetchAll(PDO::FETCH_ASSOC);

	$yearRanking = array_search($movieId, array_column($rankedYearMovies, 'id')) + 1;

	// **Fetch Oscar Win Percentage**
	$query = "SELECT total_nominations, total_wins FROM oscars WHERE movie_id = ?";
	$stmt = $pdo->prepare($query);
	$stmt->execute([$movieId]);
	$oscarsData = $stmt->fetch(PDO::FETCH_ASSOC) ?: ["total_nominations" => 0, "total_wins" => 0];

	$winPercentage = $oscarsData["total_nominations"] > 0 
		? round(($oscarsData["total_wins"] / $oscarsData["total_nominations"]) * 100, 2) . "%" 
		: "N/A";

	// **Fetch Average Ratings by Decade & Year**
	$query = "SELECT AVG(user_ratings.average_rating) 
			FROM user_ratings 
			JOIN movie_details ON user_ratings.movie_id = movie_details.movie_id
			WHERE YEAR(movie_details.release_date) BETWEEN ? AND ?";
	$stmt = $pdo->prepare($query);
	$stmt->execute([$decade, $decade + 9]);
	$averageDecadeRating = round($stmt->fetchColumn(), 2) ?: "N/A";

	$query = "SELECT AVG(user_ratings.average_rating) 
			FROM user_ratings 
			JOIN movie_details ON user_ratings.movie_id = movie_details.movie_id
			WHERE YEAR(movie_details.release_date) = ?";
	$stmt = $pdo->prepare($query);
	$stmt->execute([$releaseYear]);
	$averageYearRating = round($stmt->fetchColumn(), 2) ?: "N/A";

	// **Return Analytics Data**
	$analyticsData = [
		"overall_ranking" => $overallRanking,
		"overall_amount" => $totalMovies,
		"decade_ranking" => $decadeRanking,
		"decade_amount" => $totalDecadeMovies,
		"year_ranking" => $yearRanking,
		"year_amount" => $totalYearMovies,
		"win_percentage" => $winPercentage,
		"average_decade_rating" => $averageDecadeRating,
		"average_year_rating" => $averageYearRating
	];

	header("Content-Type: application/json");
	echo json_encode($analyticsData, JSON_PRETTY_PRINT);