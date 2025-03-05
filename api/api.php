<?php

	require 'config.php';

	$search = isset($_GET['search']) ? trim($_GET['search']) : '';

	$query = "SELECT id, title, release_date, poster FROM movies";

	if (!empty($search)) {
		$query .= " WHERE title LIKE :search";
	}

	$stmt = $pdo->prepare($query);

	if (!empty($search)) {
		$stmt->bindValue(':search', "%$search%", PDO::PARAM_STR);
	}

	$stmt->execute();
	$movies = $stmt->fetchAll(PDO::FETCH_ASSOC);

	header('Content-Type: application/json');
	echo json_encode($movies);
