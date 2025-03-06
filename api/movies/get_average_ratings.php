<?php

	require __DIR__ . '/../../database/config.php';

	header('Content-Type: application/json');

	$query = "SELECT user_ratings.id, user_ratings.average_rating, movies.title 
		FROM user_ratings 
		JOIN movies ON user_ratings.id = movies.id 
		WHERE average_rating IS NOT NULL";

	$stmt = $pdo->prepare($query);
	$stmt->execute();
	$ratingsData = $stmt->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($ratingsData);

