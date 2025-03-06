document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("style-toggle-btn");
    const themeSection = document.getElementById("theme-section");

    if (!toggleBtn || !themeSection) {
        console.error("Theme toggle elements not found!");
        return;
    }

    // Initially hide theme section
    themeSection.style.display = "none";

    // Show theme section when button is clicked
    toggleBtn.addEventListener("click", () => {
        themeSection.style.display = "block";
    });

    // Hide theme section when the mouse leaves it
    themeSection.addEventListener("mouseleave", () => {
        themeSection.style.display = "none";
    });
});
