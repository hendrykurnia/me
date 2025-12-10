// --- Load chatbot elements and knowledgebase ---
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

// --- CLICK OUTSIDE TO CLOSE ---
document.addEventListener('click', (e) => {
    if (isOpen) {
        if (!chatbotContainer.contains(e.target) && !chatbotBubble.contains(e.target)) {
            isOpen = false;
            chatbotContainer.style.display = 'none';
            chatbotBubble.style.display = 'flex';
        }
    }
});

// --- OPEN CHAT ---
chatbotBubble.addEventListener('click', (e) => {
    e.stopPropagation(); 
    isOpen = true; 
    chatbotContainer.style.display = 'flex'; 
    chatbotBubble.style.display = 'none';
});

// --- CLOSE CHAT ---
header.addEventListener('click', (e) => {
    e.stopPropagation(); 
    isOpen = false;
    chatbotContainer.style.display = 'none'; 
    chatbotBubble.style.display = 'flex';
});

// --- ADD MESSAGE (unchanged for user messages) ---
function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.classList.add('chatbot-message', sender);
    msg.innerHTML = text;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// --- BOT TYPING EFFECT ---
function typeMessage(htmlText, sender) {
    return new Promise(resolve => {
        const msg = document.createElement('div');
        msg.classList.add('chatbot-message', sender);
        messagesContainer.appendChild(msg);

        let i = 0;
        let content = '';
        const speed = 18; // typing speed in milliseconds (faster)

        function type() {
            if (i >= htmlText.length) {
                resolve();
                return;
            }

            if (htmlText[i] === '<') {
                // If it's an HTML tag, add the full tag immediately
                const endTag = htmlText.indexOf('>', i);
                if (endTag !== -1) {
                    content += htmlText.substring(i, endTag + 1);
                    i = endTag + 1;
                    msg.innerHTML = content;
                    messagesContainer.scrollTop = messagesContainer.scrollHeight;
                    type(); // continue immediately
                    return;
                }
            } else {
                // Normal character: append one character at a time
                content += htmlText[i];
                i++;
                msg.innerHTML = content;
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                setTimeout(type, speed);
            }
        }

        type();
    });
}

function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
}

// --- Response Logic ---
function getResponse(input) {
    const lower = input.toLowerCase();

    for (let entry of knowledgeBase) {
        const regex = new RegExp(`\\b${entry.keyword.toLowerCase()}\\b`);
        if (regex.test(lower)) {
            if (entry.answer && entry.answer.trim().length > 0) { 
                return entry.answer;
            }
        }
    }

    return "I’m not able to provide that information at this moment. Please call <a href='tel:6692389972'>(669)238-9972</a> or <br> email to <a href='mailto:hendry.itbizpro@gmail.com'>hendry.itbizpro@gmail.com</a> for more details.";
}

// --- Input Handler with Typing Effect ---
inputField.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && inputField.value.trim() !== "") {
        e.preventDefault();

        const userText = inputField.value.trim();
        addMessage(userText, 'user');
        inputField.value = '';

        const botReply = getResponse(userText);

        // delay before bot starts typing
        setTimeout(async () => {
            removeTypingIndicator();
            await typeMessage(botReply, 'bot');
        }, 600);
    }
});