<?php

	require __DIR__ . '/../../database/config.php';

	header('Content-Type: application/json');

	$query = "SELECT movie_details.movie_id, movie_details.mpa_rating 
		FROM movie_details 
		WHERE movie_details.mpa_rating IS NOT NULL";

	$stmt = $pdo->prepare($query);
	$stmt->execute();
	$mpaRatings = $stmt->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($mpaRatings);