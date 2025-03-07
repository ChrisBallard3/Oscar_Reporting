<?php

	require __DIR__ . '/../../database/config.php';

	header('Content-Type: application/json');

	$searchTerm = $_GET['name'] ?? '';

	if (empty($searchTerm)) {
		echo json_encode([]);
		exit;
	}

	$searchTerm = "%$searchTerm%";

	$query = "SELECT 
		movies.id AS movie_id, 
		movies.title,
		(
			SELECT GROUP_CONCAT(DISTINCT name ORDER BY name SEPARATOR ', ') 
			FROM writers 
			WHERE writers.movie_id = movies.id 
			AND writers.name LIKE :search
		) AS writers,
		(
			SELECT GROUP_CONCAT(DISTINCT name ORDER BY name SEPARATOR ', ') 
			FROM directors 
			WHERE directors.movie_id = movies.id 
			AND directors.name LIKE :search
		) AS directors,
		(
			SELECT GROUP_CONCAT(DISTINCT name ORDER BY name SEPARATOR ', ') 
			FROM cast 
			WHERE cast.movie_id = movies.id 
			AND cast.name LIKE :search
		) AS cast
	FROM movies
	WHERE movies.id IN (
		SELECT movie_id FROM writers 
		WHERE name LIKE :search
		UNION
		SELECT movie_id FROM directors 
		WHERE name LIKE :search
		UNION
		SELECT movie_id FROM cast 
		WHERE name LIKE :search
	)";

	$stmt = $pdo->prepare($query);
	$stmt->bindParam(':search', $searchTerm, PDO::PARAM_STR);
	$stmt->execute();
	$peopleData = $stmt->fetchAll(PDO::FETCH_ASSOC);

	echo json_encode($peopleData);
