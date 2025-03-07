<?php

	require __DIR__ . '/../../database/config.php';

	header('Content-Type: application/json');
	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	$movieId = $_GET['id'] ?? null;
	if (!$movieId) {
		die(json_encode(["error" => "No movie ID provided"]));
	}

	//Fetch Movie Information
	$query = "SELECT movies.title, movies.description, movie_details.*, 
			COALESCE(box_office_earnings.box_office_earnings, 0) AS box_office_earnings,
			COALESCE(user_ratings.average_rating, 'Not Rated') AS average_rating
		FROM movies 
		JOIN movie_details ON movies.id = movie_details.movie_id
		LEFT JOIN box_office_earnings ON movies.id = box_office_earnings.movie_id
		LEFT JOIN user_ratings ON movies.id = user_ratings.movie_id
		WHERE movies.id = ?";

	$stmt = $pdo->prepare($query);
	$stmt->execute([$movieId]);
	$movie = $stmt->fetch(PDO::FETCH_ASSOC);

	if (!$movie) {
		die(json_encode(["error" => "Movie not found"]));
	}

	//Fetch Cast
	$query = "SELECT name 
		FROM cast 
		WHERE movie_id = ?";

	$stmt = $pdo->prepare($query);
	$stmt->execute([$movieId]);
	$movie['cast'] = $stmt->fetchAll(PDO::FETCH_COLUMN) ?: [];

	//Fetch Director
	$query = "SELECT name 
		FROM directors 
		WHERE movie_id = ?";

	$stmt = $pdo->prepare($query);
	$stmt->execute([$movieId]);
	$movie['director'] = $stmt->fetchColumn() ?: "Unknown";

	//Fetch Writer
	$query = "SELECT name 
		FROM writers 
		WHERE movie_id = ?";

	$stmt = $pdo->prepare($query);
	$stmt->execute([$movieId]);
	$movie['writer'] = $stmt->fetchColumn() ?: "Unknown";

	//Fetch Oscars Details
	$query = "SELECT oscar_details.oscar_year, oscar_details.ceremony_number, oscars.total_nominations, oscars.total_wins, oscar_details.category, oscar_details.nominee, oscar_details.win
		FROM oscars
		JOIN oscar_details ON oscars.movie_id = oscar_details.movie_id
		WHERE oscars.movie_id = ?";

	$stmt = $pdo->prepare($query);
	$stmt->execute([$movieId]);
	$oscarData = $stmt->fetch(PDO::FETCH_ASSOC) ?: [
		"oscar_year" => "N/A",
		"ceremony_number" => "N/A",
		"total_nominations" => 0,
		"total_wins" => 0
	];

	//Add Oscars Data to Movie
	$movie['oscars'] = $oscarData;

	$analyticsApiUrl = "http://localhost:8888/Oscar_Reporting/api/movies/get_analytics.php?id=" . $movieId;
	$analyticsResponse = file_get_contents($analyticsApiUrl);
	$analyticsData = json_decode($analyticsResponse, true) ?: [];

	$movie["analytics"] = $analyticsData;

	header('Content-Type: application/json');
	echo json_encode($movie, JSON_PRETTY_PRINT);
