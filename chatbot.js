const messagesContainer = document.getElementById('chatbot-messages');
const inputField = document.getElementById('chatbot-input');
const header = document.getElementById('chatbot-header');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotBubble = document.getElementById('chatbot-bubble');
const knowledgebase_url = "https://raw.githubusercontent.com/hendrykurnia/me/main/knowledgebase.csv";

let isOpen = false; // Initial state: closed
let knowledgeBase = [];

// --- Load Knowledge Base (UNCHANGED) ---
async function loadKnowledgeBase() {
    try {
        const response = await fetch(knowledgebase_url);
        const text = await response.text();
        const lines = text.split('\n').slice(1);
        knowledgeBase = lines.map(line => {
            const parts = line.split(/,(.+)/);
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


// --- NEW DOCUMENT CLICK-OUTSIDE LISTENER ---
document.addEventListener('click', (e) => {
    if (isOpen) {
        // Check if the click occurred OUTSIDE the main chat container AND OUTSIDE the bubble
        if (!chatbotContainer.contains(e.target) && !chatbotBubble.contains(e.target)) {
            // Close the chat
            isOpen = false;
            chatbotContainer.style.display = 'none';
            chatbotBubble.style.display = 'flex';
        }
    }
});


// --- EVENT LISTENER FOR THE FLOATING BUBBLE (To OPEN) ---
chatbotBubble.addEventListener('click', (e) => {
    e.stopPropagation(); 
    isOpen = true; 
    // Show the entire container, which should automatically display its children (messages, input)
    chatbotContainer.style.display = 'flex'; 
    chatbotBubble.style.display = 'none';
});


// --- EVENT LISTENER FOR THE HEADER (To CLOSE) ---
header.addEventListener('click', (e) => {
    e.stopPropagation(); 
    isOpen = false;
    chatbotContainer.style.display = 'none'; 
    chatbotBubble.style.display = 'flex';
});


// --- Message and Input Handlers (UNCHANGED) ---
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
            // Check if the answer is present and not just whitespace
            if (entry.answer && entry.answer.trim().length > 0) { 
                return entry.answer;
            }
        }
    }
    return "I’m not able to provide that information at this moment. Please call <a href='tel:6692389972'>(669)238-9972</a> or <br> email to <a href='mailto:hendry.itbizpro@gmail.com'>hendry.itbizpro@gmail.com</a> for more details.";
}

inputField.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && inputField.value.trim() !== "") {
        e.preventDefault();
        const userText = inputField.value.trim();
        addMessage(userText, 'user');
        addMessage(getResponse(userText), 'bot');
        inputField.value = '';
    }
});