<?php

	require __DIR__ . '/../../database/config.php';

	header('Content-Type: application/json');

	$query = "SELECT movie_details.id, movie_details.runtime, movies.title 
		FROM movie_details 
		JOIN movies ON movie_details.id = movies.id 
		WHERE movie_details.runtime IS NOT NULL AND movie_details.runtime > 0";

	$stmt = $pdo->prepare($query);
	$stmt->execute();
	$movieRuntimes = $stmt->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($movieRuntimes);