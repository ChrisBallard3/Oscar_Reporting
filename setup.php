<?php

	$host = '127.0.0.1';
	$user = 'root';
	$pass = 'root';
	$port = 8889;
	$dbName = 'oscars_db';


	try {
		//Connect without specifying database
		$pdo = new PDO("mysql:host=$host;port=$port", $user, $pass);
		$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

		//Create database if it doesn't exist
		$pdo->exec("CREATE DATABASE IF NOT EXISTS $dbName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
		echo "Database '$dbName' was created/already existed.<br>";

		//Connect to database
		$pdo->exec("USE $dbName");

		//Call migration files
		$migrationFiles = glob(__DIR__ . '/database/migrations/*.sql');

		foreach ($migrationFiles as $file) {
			$query = file_get_contents($file);
			$pdo->exec($query);
			echo "Executed migration: " . basename($file) . "\n";
		}
		echo "All Migrations Executed Successfully!";

	} catch (PDOException $e) {
		die("Database setup failed: " . $e->getMessage());
	}
