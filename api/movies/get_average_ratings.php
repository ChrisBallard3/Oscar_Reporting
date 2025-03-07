<?php

	require __DIR__ . '/../../database/config.php';

	header('Content-Type: application/json');

	$query = "SELECT user_ratings.movie_id, user_ratings.average_rating, movies.title 
		FROM user_ratings 
		JOIN movies ON user_ratings.movie_id = movies.id 
		WHERE user_ratings.average_rating IS NOT NULL;";

	$stmt = $pdo->prepare($query);
	$stmt->execute();
	$ratingsData = $stmt->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($ratingsData);

