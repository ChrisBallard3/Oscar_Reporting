	CREATE TABLE IF NOT EXISTS writers (
		id INT AUTO_INCREMENT PRIMARY KEY,
		movie_id INT NOT NULL,
		name VARCHAR(100),
		FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
	);