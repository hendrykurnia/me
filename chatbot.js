const messagesContainer = document.getElementById('chatbot-messages');
const inputField = document.getElementById('chatbot-input');
const header = document.getElementById('chatbot-header');

let isOpen = true;

// Toggle chatbot open/close
header.addEventListener('click', () => {
    isOpen = !isOpen;
    messagesContainer.style.display = isOpen ? 'block' : 'none';
    inputField.style.display = isOpen ? 'block' : 'none';
});

const profileData = {
    name: "Hendry Kurnia",
    email: "hendry.itbizpro@gmail.com",
    phone: "(669) 238-9972",
    linkedin: "https://linkedin.com/in/hendrykurnia",
    location: "Patterson, California, United States",
    about: "I have 6+ years in systems integration and automation, building scalable workflows across revenue and billing systems. At Couchbase, I led integrations connecting Salesforce, NetSuite, Stripe, AWS, and internal platforms using SnapLogic, Workato, and Databricks. I’ve modernized billing pipelines, automated reconciliation, improved onboarding and payment flows, and maintain SOX-compliant documentation. I began in Salesforce administration and Sales Operations, then moved into designing API-based workflows and supporting the full quote-to-cash lifecycle.",
    skills: ["Systems Integration", "Sales Operations", "Data Warehouse", "Cloud Consumption-based Billing", "Workato", "SnapLogic", "Salesforce", "Databricks", "Python","SOX Compliance", "Project Management"],
    contact: "Email: hendry.itbizpro@gmail.com<br>Phone: (669)238-9972",
    experiences: [
        {
            role: "Integrations Engineer",
            date: "Aug 2024 - Nov 2025 | Remote",
            details: "Led integration initiatives connecting Salesforce, NetSuite, Stripe, Clazar.io, Tackle.io, AWS, and internal platforms using SnapLogic, Workato, and Databricks..."
        },
        {
            role: "Integration Systems Analyst",
            date: "Nov 2022 - Aug 2024 | Remote",
            details: "Designed and launched automated workflows, integrated cloud business systems, optimized pipelines..."
        },
        {
            role: "Sales Operations Analyst / Salesforce Administrator",
            date: "May 2020 - Nov 2022 | Hybrid",
            details: "Supported global Sales, Finance, Revenue, and Legal teams by resolving complex Salesforce CRM requests..."
        },
        {
            role: "Junior Salesforce Administrator",
            date: "Jul 2019 - May 2020 | On-site",
            details: "Resolved data integrity issues and configured core Salesforce features..."
        }
    ]
};

function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.classList.add('chatbot-message', sender);
    msg.innerHTML = text;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getResponse(input)  {
    const lower = input.toLowerCase();
    if (lower.includes("name")) return profileData.name;
    if (lower.includes("email")) return profileData.email;
    if (lower.includes("phone") || lower.includes("call")) return profileData.phone;
    if (lower.includes("contact")) return profileData.contact;
    if (lower.includes("linkedin") || lower.includes("social")) return profileData.linkedin;
    if (lower.includes("location") || lower.includes("where") || lower.includes("address")) return profileData.location;
    if (lower.includes("skills")) return profileData.skills.join(", ");
    if (lower.includes("experience") || lower.includes("work") || lower.includes("job")) {
      return profileData.experiences.map(e => `${e.role} <br> (${e.date})`).join("<br><br>");
    }
    if (lower.includes("about") || lower.includes("bio") || lower.includes("profile")) return profileData.about;
    return "Sorry, I can only answer questions about my profile, skills, experiences, and contact info.";
}

inputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && inputField.value.trim() !== "") {
        const userText = inputField.value.trim();
        addMessage(userText, 'user');
        addMessage(getResponse(userText), 'bot');
        inputField.value = '';
    }
});
