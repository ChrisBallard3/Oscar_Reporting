<?php
require __DIR__ . '/../../database/config.php';

header('Content-Type: application/json');

// Get the search term from the request
$searchTerm = $_GET['name'] ?? '';

if (empty($searchTerm)) {
    echo json_encode([]);
    exit;
}

$searchTerm = "%$searchTerm%";

// Fetch only matching names for writers, directors, or cast
$query = "
    SELECT 
        movies.id, 
        movies.title,
        COALESCE(writers.names, '') AS writers,
        COALESCE(directors.names, '') AS directors,
        COALESCE(cast.names, '') AS cast
    FROM movies
    LEFT JOIN (
        SELECT movie_id, GROUP_CONCAT(DISTINCT name ORDER BY name SEPARATOR ', ') AS names 
        FROM writers 
        WHERE name LIKE :search
        GROUP BY movie_id
    ) AS writers ON writers.movie_id = movies.id
    LEFT JOIN (
        SELECT movie_id, GROUP_CONCAT(DISTINCT name ORDER BY name SEPARATOR ', ') AS names 
        FROM directors 
        WHERE name LIKE :search
        GROUP BY movie_id
    ) AS directors ON directors.movie_id = movies.id
    LEFT JOIN (
        SELECT movie_id, GROUP_CONCAT(DISTINCT name ORDER BY name SEPARATOR ', ') AS names 
        FROM cast 
        WHERE name LIKE :search
        GROUP BY movie_id
    ) AS cast ON cast.movie_id = movies.id
    WHERE writers.names IS NOT NULL OR directors.names IS NOT NULL OR cast.names IS NOT NULL
";

$stmt = $pdo->prepare($query);
$stmt->bindParam(':search', $searchTerm, PDO::PARAM_STR);
$stmt->execute();
$peopleData = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($peopleData);
?>
