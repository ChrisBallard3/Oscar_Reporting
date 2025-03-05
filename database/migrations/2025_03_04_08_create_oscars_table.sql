	CREATE TABLE IF NOT EXISTS oscars (
		id INT AUTO_INCREMENT PRIMARY KEY,
		movie_id INT NOT NULL,
		total_nominations INT,
		total_wins INT,
		FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
	);