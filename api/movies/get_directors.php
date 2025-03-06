<?php

	require __DIR__ . '/../../database/config.php';

	header('Content-Type: application/json');

	$query = "SELECT directors.id, directors.name, movies.title 
		FROM directors 
		JOIN movies ON directors.movie_id = movies.id 
		WHERE directors.name IS NOT NULL";

	$stmt = $pdo->prepare($query);
	$stmt->execute();
	$mpaRatings = $stmt->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($mpaRatings);