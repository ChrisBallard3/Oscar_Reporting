	CREATE TABLE IF NOT EXISTS box_office_earnings (
		id INT AUTO_INCREMENT PRIMARY KEY,
		movie_id INT NOT NULL,
		box_office_earnings DECIMAL(15,2),
		FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
	);