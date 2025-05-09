	CREATE TABLE IF NOT EXISTS analytics (
		id INT AUTO_INCREMENT PRIMARY KEY,
		movie_id INT NOT NULL,
		overall_ranking INT,
		overall_amount INT,
		decade_ranking INT,
		decade_amount INT,
		year_ranking INT,
		year_amount INT,
		win_percentage DECIMAL(5,2),
		average_decade_rating INT,
		average_year_rating INT,
		FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
	);