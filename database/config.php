<?php

	$host = '127.0.0.1';
	$user = 'root';
	$pass = 'root';
	$port = 8889;
	$dbName = 'oscars_db';

	try {
		$pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbName;charset=utf8mb4", $user, $pass);
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	} catch (PDOException $e) {
		die("Database connection failed: " . $e->getMessage());
	}
