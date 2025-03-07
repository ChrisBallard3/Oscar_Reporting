<?php

	require __DIR__ . '/../../database/config.php';

	header('Content-Type: application/json');

	$query = "SELECT 
			movies.id AS movie_id, 
			movies.title, 
			MAX(oscars.total_wins) AS total_wins
		FROM movies
		LEFT JOIN oscars ON movies.id = oscars.movie_id
		GROUP BY movies.id, movies.title
		ORDER BY total_wins DESC";

	$stmt = $pdo->prepare($query);
	$stmt->execute();
	$oscarWinners = $stmt->fetchAll(PDO::FETCH_ASSOC);

	foreach ($oscarWinners as &$movie) {
		$movie['total_wins'] = (int) $movie['total_wins']; 
	}
	unset($movie);

	echo json_encode($oscarWinners);
