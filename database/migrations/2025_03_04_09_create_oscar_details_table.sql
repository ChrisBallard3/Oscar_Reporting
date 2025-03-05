	CREATE TABLE IF NOT EXISTS oscar_details (
		id INT AUTO_INCREMENT PRIMARY KEY,
		movie_id INT NOT NULL,
		oscar_year INT,
		ceremony_number INT,
		category VARCHAR(100),
		nominee VARCHAR(255),
		win BOOLEAN,
		FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
	);