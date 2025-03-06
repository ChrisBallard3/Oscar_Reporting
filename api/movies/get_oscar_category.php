<?php

	require __DIR__ . '/../../database/config.php';

	$movieId = $_GET['id'] ?? null;
	if (!$movieId) {
		die(json_encode(["error" => "No movie ID provided"]));
	}

	$query = "SELECT oscar_details.oscar_year, oscar_details.ceremony_number, oscar_details.category 
		FROM oscar_details 
		WHERE movie_id = ?";

	$stmt = $pdo->prepare($query);
	$stmt->execute([$movieId]);
	$movieOscars = $stmt->fetchAll(PDO::FETCH_ASSOC);

	if (!$movieOscars) {
		die(json_encode(["error" => "No Oscar data found for this movie."]));
	}

	$allCategories = [];

	foreach ($movieOscars as $oscar) {
		$category = $oscar['category'];
		$oscarYear = $oscar['oscar_year'];
		$ceremonyNumber = $oscar['ceremony_number'];

		$query = "SELECT nominee, win 
			FROM oscar_details 
			WHERE oscar_year = ? 
			AND category = ? 
			ORDER BY win DESC";

		$stmt = $pdo->prepare($query);
		$stmt->execute([$oscarYear, $category]);
		$nominees = $stmt->fetchAll(PDO::FETCH_ASSOC);

		$allCategories[] = [
			"category" => $category,
			"oscar_year" => $oscarYear,
			"ceremony_number" => $ceremonyNumber,
			"nominees" => $nominees
		];
	}

	header("Content-Type: application/json");
	echo json_encode(["categories" => $allCategories], JSON_PRETTY_PRINT);
