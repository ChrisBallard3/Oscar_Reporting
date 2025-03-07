<?php

	require 'config.php';

	function getEnvVariable($key) {
		$lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
		foreach ($lines as $line) {
			list($envKey, $value) = explode("=", $line, 2);
			if (trim($envKey) === $key) {
				return trim($value);
			}
		}
		return null;
	}

	$apiKey = getEnvVariable('TMDB_API_KEY');

	$stmt = $pdo->query("SELECT id, title FROM movies WHERE title IS NOT NULL AND title != ''");
	$movies = $stmt->fetchAll(PDO::FETCH_ASSOC);

	foreach ($movies as $movie) {
		$movieId = $movie['id'];
		$title = str_replace(["'", '"', "’", "‘"], "", $movie['title']);
		$title = preg_replace('/\s+/', ' ', trim($title));
		$title = urlencode($title);

		//Fetch movie ID from TMDB
		$searchUrl = "https://api.themoviedb.org/3/search/movie?query={$title}&api_key={$apiKey}";
		$searchResponse = file_get_contents($searchUrl);
		$searchData = json_decode($searchResponse, true);

		if (!$searchResponse || empty($searchData['results'])) {
			echo "TMDB API Error for '{$movie['title']}': No results found.\n";
			continue;
		}

		$movieData = $searchData['results'][0];
		$tmdbId = $movieData['id'];

		//Fetch Detailed Movie Info
		$detailsUrl = "https://api.themoviedb.org/3/movie/{$tmdbId}?api_key={$apiKey}&append_to_response=credits";
		$detailsResponse = file_get_contents($detailsUrl);
		$detailsData = json_decode($detailsResponse, true);

		$releaseDate = !empty($detailsData['release_date']) ? date('Y-m-d', strtotime($detailsData['release_date'])) : null;

		//Fetch MPA Rating
		$ratingUrl = "https://api.themoviedb.org/3/movie/{$tmdbId}/release_dates?api_key=$apiKey";
		$ratingResponse = file_get_contents($ratingUrl);
		$ratingData = json_decode($ratingResponse, true);

		$mpaRating = null;
		if (!empty($ratingData['results'])) {
			foreach ($ratingData['results'] as $result) {
				if ($result['iso_3166_1'] === 'US') {
					foreach ($result['release_dates'] as $release) {
						if (!empty($release['certification'])) {
							$mpaRating = $release['certification'];
							break 2;
						}
					}
				}
			}
		}

		//Extract genres and store as a comma-separated string
		$genres = !empty($detailsData['genres']) 
			? implode(', ', array_column($detailsData['genres'], 'name')) 
			: null;

		//Insert or Update movie_details
		$stmt = $pdo->prepare("INSERT INTO movie_details (movie_id, release_date, mpa_rating, runtime, genres, poster, production_company, language) 
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)
			ON DUPLICATE KEY UPDATE 
			release_date=VALUES(release_date),
			mpa_rating=VALUES(mpa_rating),
			runtime=VALUES(runtime),
			genres=VALUES(genres),
			poster=VALUES(poster),
			production_company=VALUES(production_company),
			language=VALUES(language)");

		$stmt->execute([
			$movieId,
			$releaseDate,
			$mpaRating,
			$detailsData['runtime'] ?? null,
			$genres,
			!empty($detailsData['poster_path']) ? "https://image.tmdb.org/t/p/w500{$detailsData['poster_path']}" : null,
			$detailsData['production_companies'][0]['name'] ?? null,
			$detailsData['original_language'] ?? null
		]);

		echo "Updated details for: {$movie['title']}\n";

		//Insert movie description
		$description = $detailsData['overview'] ?? 'No description available';
		$stmt = $pdo->prepare("UPDATE movies SET description = ? WHERE id = ?");
		$stmt->execute([$description, $movieId]);

		//Insert Writers
		if (!empty($detailsData['credits']['crew'])) {
			foreach ($detailsData['credits']['crew'] as $crew) {
				if ($crew['job'] === 'Writer') {
					$stmt = $pdo->prepare("INSERT IGNORE INTO writers (movie_id, name) VALUES (?, ?)");
					$stmt->execute([$movieId, $crew['name']]);
				}
			}
		}

		//Insert Directors
		if (!empty($detailsData['credits']['crew'])) {
			foreach ($detailsData['credits']['crew'] as $crew) {
				if ($crew['job'] === 'Director') {
					$stmt = $pdo->prepare("INSERT IGNORE INTO directors (movie_id, name) VALUES (?, ?)");
					$stmt->execute([$movieId, $crew['name']]);
				}
			}
		}

		//Insert Cast
		if (!empty($detailsData['credits']['cast'])) {
			foreach ($detailsData['credits']['cast'] as $actor) {
				$stmt = $pdo->prepare("INSERT IGNORE INTO cast (movie_id, cast) VALUES (?, ?)");
				$stmt->execute([$movieId, $actor['original_name']]);
			}
		}

		//Insert Box Office Earnings
		$boxOffice = $detailsData['revenue'] ?? 0;
		$stmt = $pdo->prepare("INSERT INTO box_office_earnings (movie_id, box_office_earnings) 
			VALUES (?, ?) 
			ON DUPLICATE KEY UPDATE 
			box_office_earnings = VALUES(box_office_earnings)");
		$stmt->execute([$movieId, $boxOffice]);

		//Insert Average Rating
		$averageRating = $detailsData['vote_average'] ?? null;
		$stmt = $pdo->prepare("INSERT INTO user_ratings (movie_id, average_rating) 
			VALUES (?, ?)
			ON DUPLICATE KEY UPDATE 
			average_rating = VALUES(average_rating)");
		$stmt->execute([$movieId, $averageRating]);

		echo "Finished processing: {$movie['title']}\n";
	}

	echo "🎉 All movies processed!\n";
