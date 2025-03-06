	CREATE TABLE IF NOT EXISTS movie_details (
		id INT AUTO_INCREMENT PRIMARY KEY,
		movie_id INT NOT NULL,
		release_date DATE,
		mpa_rating VARCHAR(10),
		runtime INT,
		genre VARCHAR(255),
		poster VARCHAR(255),
		production_company VARCHAR(100),
		language VARCHAR(50),
		FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
	);