<?php

	require __DIR__ . '/../../database/config.php';

	header('Content-Type: application/json');

	$query = "SELECT title, description 
		FROM movies
		WHERE description IS NOT NULL";

	$stmt = $pdo->prepare($query);
	$stmt->execute();
	$mpaRatings = $stmt->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($mpaRatings);