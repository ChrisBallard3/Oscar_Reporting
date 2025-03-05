<?php

	require 'config.php';

	$oscar_csv = 'oscars_data.csv';

	if (!file_exists($oscar_csv)) {
		die("CSV file not found!");
	}

	$pdo->beginTransaction();

	try {
		$handle = fopen($oscar_csv, "r");
		if ($handle === false) {
			die("Error opening CSV file.");
		}

		fgetcsv($handle, 1000, ",", '"', "\\");

		while (($row = fgetcsv($handle, 0, ",", '"', "\\")) !== false) {
			list($year_film, $year_ceremony, $ceremony, $category, $name, $film, $winner) = $row;

			$winner = ($winner === 'True') ? 1 : 0; //Boolean

			//Check if movie already exists
			$stmt = $pdo->prepare("SELECT id FROM movies WHERE title = ?");
			$stmt->execute([$film]);
			$movieId = $stmt->fetchColumn();

			//Insert movie if not exists
			if (!$movieId) {
				$stmt = $pdo->prepare("INSERT INTO movies (title) VALUES (?)");
				$stmt->execute([$film]);
				$movieId = $pdo->lastInsertId();
			}

			//Insert Oscar details
			$stmt = $pdo->prepare("INSERT INTO oscar_details (movie_id, oscar_year, ceremony_number, category, nominee, win) VALUES (?, ?, ?, ?, ?, ?)ON DUPLICATE KEY UPDATE movie_id=movie_id");
			$stmt->execute([$movieId, $year_film, $ceremony, $category, $name, $winner]);
		}

		fclose($handle);
		$pdo->commit();

		echo "CSV import completed successfully!";
	} catch (Exception $e) {
		$pdo->rollBack();
		die("CSV import failed: " . $e->getMessage());
	}
