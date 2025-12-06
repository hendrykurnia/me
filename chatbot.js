const messagesContainer = document.getElementById('chatbot-messages');
const inputField = document.getElementById('chatbot-input');
const header = document.getElementById('chatbot-header');
const knowledgebase_url = "https://raw.githubusercontent.com/hendrykurnia/me/main/knowledgebase.csv";

let isOpen = true;
let knowledgeBase = [];

// Toggle chatbot
header.addEventListener('click', () => {
    isOpen = !isOpen;
    messagesContainer.style.display = isOpen ? 'block' : 'none';
    inputField.style.display = isOpen ? 'block' : 'none';
});

// Load CSV knowledge base
async function loadKnowledgeBase() {
    try {
        const response = await fetch(knowledgebase_url);
        const text = await response.text();

        const lines = text.split('\n').slice(1); // skip header

        knowledgeBase = lines.map(line => {
            const parts = line.split(/,(.+)/); // split only first comma
            return {
                keyword: parts[0].trim().toLowerCase(),
                answer: parts[1] ? parts[1].trim().replace(/^"|"$/g, '') : ""
            };
        });
    } catch (error) {
        console.error("Error loading CSV", error);
    }
}

loadKnowledgeBase();


function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.classList.add('chatbot-message', sender);
    msg.innerHTML = text;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getResponse(input) {
    const lower = input.toLowerCase();

    for (let entry of knowledgeBase) {
        const regex = new RegExp(`\\b${entry.keyword.toLowerCase()}\\b`);
        if (regex.test(lower)) {
            return entry.answer;
        }
    }

    return "Sorry, I don't have an answer for that yet.";
}

inputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && inputField.value.trim() !== "") {
        const userText = inputField.value.trim();
        addMessage(userText, 'user');
        addMessage(getResponse(userText), 'bot');
        inputField.value = '';
    }
});