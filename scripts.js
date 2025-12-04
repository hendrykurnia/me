// Expand/Collapse Experience
document.querySelectorAll(".experience-header").forEach(header => {
    header.addEventListener("click", () => {
        const details = header.nextElementSibling;
        details.style.display = details.style.display === "block" ? "none" : "block";
    });
});
