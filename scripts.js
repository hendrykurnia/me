// Expand/Collapse Experience
document.querySelectorAll(".experience-header").forEach(header => {
    header.addEventListener("click", () => {
        const details = header.nextElementSibling;
        details.style.display = details.style.display === "block" ? "none" : "block";
    });
});

document.getElementById('downloadResume').addEventListener('click', async function(e) {
    e.preventDefault();

    const resumeFile = 'Hendry_Kurnia_Resume.pdf'
    const response = await fetch('https://download-hendry.s3.us-west-1.amazonaws.com/' + resumeFile);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = resumeFile;
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url); // cleanup
});

/*
AWS S3 CORS Policy Explanation:

[
    {
        "AllowedHeaders": ["*"],       // Allow all headers in the request (e.g., Authorization, Content-Type)
        "AllowedMethods": ["GET"],     // Only allow GET requests to access S3 objects
        "AllowedOrigins": ["*"],       // Allow requests from any origin (any website)
        "ExposeHeaders": []            // No headers are exposed to the browser in the response
    }
]

This policy allows any website to fetch S3 objects via GET requests, 
with any request headers, but does not expose any response headers to the client.
*/