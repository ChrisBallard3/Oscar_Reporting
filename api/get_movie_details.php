<?php

require __DIR__ . '/../database/config.php';

$movieId = $_GET['id'] ?? null;
if (!$movieId) {
    die(json_encode(["error" => "No movie ID provided"]));
}

// **Fetch Movie Information**
$query = "SELECT movies.title, movies.description, movie_details.*
          FROM movies 
          JOIN movie_details ON movies.id = movie_details.movie_id
          WHERE movies.id = ?";
$stmt = $pdo->prepare($query);
$stmt->execute([$movieId]);
$movie = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$movie) {
    die(json_encode(["error" => "Movie not found"]));
}

// **Fetch Cast**
$query = "SELECT cast FROM cast WHERE movie_id = ?";
$stmt = $pdo->prepare($query);
$stmt->execute([$movieId]);
$movie['cast'] = $stmt->fetchAll(PDO::FETCH_COLUMN) ?: [];

// **Fetch Director**
$query = "SELECT name FROM directors WHERE movie_id = ?";
$stmt = $pdo->prepare($query);
$stmt->execute([$movieId]);
$movie['director'] = $stmt->fetchColumn() ?: "Unknown";

// **Fetch Writer**
$query = "SELECT name FROM writers WHERE movie_id = ?";
$stmt = $pdo->prepare($query);
$stmt->execute([$movieId]);
$movie['writer'] = $stmt->fetchColumn() ?: "Unknown";

// **Fetch Oscars & Oscar Year**
$query = "SELECT oscar_details.oscar_year, oscar_details.ceremony_number, oscars.total_nominations, oscars.total_wins, oscar_details.category, oscar_details.nominee, oscar_details.win
          FROM oscars
          JOIN oscar_details ON oscars.movie_id = oscar_details.movie_id
          WHERE oscars.movie_id = ?";
$stmt = $pdo->prepare($query);
$stmt->execute([$movieId]);
$oscarData = $stmt->fetch(PDO::FETCH_ASSOC) ?: [
    "oscar_year" => "N/A",
    "ceremony_number" => "N/A",
    "total_nominations" => 0,
    "total_wins" => 0
];

// **Fetch Oscar Nominees**
$query = "SELECT category, nominee, won FROM oscar_nominees WHERE movie_id = ?";
$stmt = $pdo->prepare($query);
$stmt->execute([$movieId]);
$oscarData['nominees'] = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

// **Add Oscars Data to Movie**
$movie['oscars'] = $oscarData;

header('Content-Type: application/json');
echo json_encode($movie, JSON_PRETTY_PRINT);
