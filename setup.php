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

		//Create migrations table (if it doesn't exist)
		$pdo->exec("CREATE TABLE IF NOT EXISTS migrations (
			id INT AUTO_INCREMENT PRIMARY KEY,
			migration_name VARCHAR(255) UNIQUE NOT NULL,
			executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)");

		//Get already applied migrations
		$appliedMigrations = $pdo->query("SELECT migration_name FROM migrations")->fetchAll(PDO::FETCH_COLUMN);
		$migrationFiles = glob(__DIR__ . '/database/migrations/*.sql');

		foreach ($migrationFiles as $file) {
			$migrationName = basename($file);

			//Skip if migration has already happened
			if (in_array($migrationName, $appliedMigrations)) {
				echo "Skipping migration: $migrationName (already applied)<br>";
				continue;
			}

			//Apply migration
			$query = file_get_contents($file);
			$pdo->exec($query);

			//Log applied migration
			$pdo->prepare("INSERT INTO migrations (migration_name) VALUES (?)")->execute([$migrationName]);
			echo "Executed migration: $migrationName<br>";
		}

		echo "All Migrations Executed Successfully!";

	} catch (PDOException $e) {
		die("Database setup failed: " . $e->getMessage());
	}
