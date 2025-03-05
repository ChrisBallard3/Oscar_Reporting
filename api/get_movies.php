<?php

	require __DIR__ . '/../database/config.php';

	//Fetch unique movies sorted by most Oscar wins
	$query = "SELECT movies.id, movies.title, movies.description, 
			COALESCE(oscars.total_wins, 0) AS total_wins
			FROM movies
			LEFT JOIN oscars ON movies.id = oscars.movie_id
			WHERE oscars.total_wins IS NOT NULL
			GROUP BY movies.id, movies.title, movies.description, total_wins
			ORDER BY total_wins DESC";

	$stmt = $pdo->prepare($query);
	$stmt->execute();
	$movies = $stmt->fetchAll(PDO::FETCH_ASSOC);

	header('Content-Type: application/json');
	echo json_encode($movies);
