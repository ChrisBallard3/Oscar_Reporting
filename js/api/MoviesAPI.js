
	export async function fetchMovies() {
		try {
			const response = await fetch("http://localhost:8888/Oscar_Reporting/api/movies/get_movies.php");
			const data = await response.json();

			if (!Array.isArray(data) || data.length === 0) {
				return [];
			}
			return data;
		} catch (error) {
			console.error("Error fetching movies:", error);
			return [];
		}
	}

	export async function fetchFullMovie(movieId) {
		try {
			const response = await fetch(`http://localhost:8888/Oscar_Reporting/api/movies/get_full_movie_details.php?id=${movieId}`);
			const data = await response.json();
	
			if (!data || Object.keys(data).length === 0) {
				console.warn(`No movie data found for ID ${movieId}`);
				return null;
			}
	
			return data;
		} catch (error) {
			console.error("Error fetching movie details:", error);
			return null;
		}
	}
	

	export async function fetchMovieAnalytics(movieId) {
		try {
			const response = await fetch(`http://localhost:8888/Oscar_Reporting/api/movies/get_movie_analytics.php?id=${movieId}`);
			const data = await response.json();

			if (data.error) {
				console.error("Error fetching analytics:", data.error);
				return null;
			}
			return data;
		} catch (error) {
			console.error("Error fetching movie analytics:", error);
			return null;
		}
	}

	export async function fetchOscarCategory(movieId) {
		try {
			const response = await fetch(`http://localhost:8888/Oscar_Reporting/api/movies/get_oscar_category.php?id=${movieId}`);
			const data = await response.json();

			if (data.error) {
				console.error("Error fetching Oscar category:", data.error);
				return null;
			}
			return data.categories;
		} catch (error) {
			console.error("Error fetching Oscar category details:", error);
			return null;
		}
	}
