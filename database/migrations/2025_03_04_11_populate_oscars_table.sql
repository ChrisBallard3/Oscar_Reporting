	INSERT INTO oscars (movie_id, total_nominations, total_wins)
	SELECT 
		movie_id, 
		COUNT(*) AS total_nominations,
		SUM(CASE WHEN win = 1 THEN 1 ELSE 0 END) AS total_wins
	FROM oscar_details
	GROUP BY movie_id
	ON DUPLICATE KEY UPDATE 
		total_nominations = VALUES(total_nominations),
		total_wins = VALUES(total_wins);