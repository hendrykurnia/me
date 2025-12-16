// Expand/Collapse Experience
document.querySelectorAll(".experience-header").forEach(header => {
    header.addEventListener("click", () => {
        const details = header.nextElementSibling;
        details.style.display = details.style.display === "block" ? "none" : "block";
    });
});

document.getElementById('downloadResume').addEventListener('click', function(e) {
    e.preventDefault(); // Prevent default link behavior
    const link = document.createElement('a');
    link.href = 'https://download-hendry.s3.us-west-1.amazonaws.com/Hendry_Hendry_Resume.pdf';
    link.download = 'Hendry_Hendry_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
