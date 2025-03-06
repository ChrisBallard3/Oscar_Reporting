
	export function formatDate(dateString) {
		if (!dateString) return "Unknown";
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
	}

	export function formatMoney(amount) {
		return amount ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount) : "N/A";
	}
