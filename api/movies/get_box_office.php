<?php

	require __DIR__ . '/../../database/config.php';

	header('Content-Type: application/json');

	$query = "SELECT box_office_earnings.movie_id, box_office_earnings.box_office_earnings, movies.title 
		FROM box_office_earnings 
		JOIN movies ON box_office_earnings.movie_id = movies.id 
		WHERE box_office_earnings.box_office_earnings IS NOT NULL 
		AND box_office_earnings.box_office_earnings > 0";

	$stmt = $pdo->prepare($query);
	$stmt->execute();
	$boxOfficeData = $stmt->fetchAll(PDO::FETCH_ASSOC);

	if (!$boxOfficeData) {
		echo json_encode(["error" => "No data found"]);
		exit;
	}

	echo json_encode($boxOfficeData);

