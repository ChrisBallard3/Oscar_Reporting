<?php

	require __DIR__ . '/../../database/config.php';

	header('Content-Type: application/json');

	$query = "SELECT id, mpa_rating FROM movie_details";
	$stmt = $pdo->prepare($query);
	$stmt->execute();
	$mpaRatings = $stmt->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($mpaRatings);