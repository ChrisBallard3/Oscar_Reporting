	CREATE TABLE IF NOT EXISTS user_ratings (
		id INT AUTO_INCREMENT PRIMARY KEY,
		movie_id INT NOT NULL,
		average_rating DECIMAL(3,1),
		FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
	);
