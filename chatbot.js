// --- Load chatbot elements and knowledgebase ---
const messagesContainer = document.getElementById('chatbot-messages');
const inputField = document.getElementById('chatbot-input');
const header = document.getElementById('chatbot-header');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotBubble = document.getElementById('chatbot-bubble');
const knowledgebase_url = "https://raw.githubusercontent.com/hendrykurnia/me/main/knowledgebase.csv";

let isOpen = false; // Initial state: closed
let knowledgeBase = [];
let greeted = false; // new flag

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
    
    if (!greeted) {
        greeted = true;
        showIntroForm();
    }
});

// --- CLOSE CHAT ---
header.addEventListener('click', (e) => {
    e.stopPropagation(); 
    isOpen = false;
    chatbotContainer.style.display = 'none'; 
    chatbotBubble.style.display = 'flex';
});

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

// --- Function to get information about the visitor ---
function showIntroForm() {
    const bubbleWrapper = document.createElement("div");
    bubbleWrapper.classList.add("chatbot-message", "bot");
    bubbleWrapper.id = "intro-bubble";  // ⭐ wrapper so we can remove full bubble
    messagesContainer.appendChild(bubbleWrapper);

    const formHtml = `
        <div id="intro-form" style="display: flex; flex-direction: column; gap: 10px; padding: 10px; box-sizing: border-box; width: 100%;">
            <p style="margin: 0 0 5px 0; font-weight: 500;">
                Hello! I’m here to help you learn more about my work and expertise. <br><br>Could you tell me more about yourself?
            </p>
            <input type="text" id="user-name" placeholder="Your Name" required
                style="padding: 10px; border-radius: 5px; border: 1px solid #ccc; width: calc(100% - 20px); font-size: 14px; box-sizing: border-box;">
            <input type="email" id="user-email" placeholder="Your Email" required
                style="padding: 10px; border-radius: 5px; border: 1px solid #ccc; width: calc(100% - 20px); font-size: 14px; box-sizing: border-box;">
            <textarea id="user-message" placeholder="Your Message (optional)"
                style="padding: 10px; border-radius: 5px; border: 1px solid #ccc; width: calc(100% - 20px); font-size: 14px; resize: vertical; min-height: 60px; box-sizing: border-box;"></textarea>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="skip-btn" style="padding: 8px 16px; background-color: #f0f0f0; border: none; border-radius: 5px; cursor: pointer; font-weight: 500;">Skip</button>
                <button id="send-btn" style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 500;">Send</button>
            </div>
        </div>
    `;
    
    bubbleWrapper.innerHTML = formHtml;

    // Prevent close-on-click
    bubbleWrapper.addEventListener('click', e => e.stopPropagation());

    const sendBtn = bubbleWrapper.querySelector("#send-btn");
    const skipBtn = bubbleWrapper.querySelector("#skip-btn");

    // --- SEND ---
    sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const name = document.getElementById('user-name').value.trim();
        const email = document.getElementById('user-email').value.trim();
        const message = document.getElementById('user-message').value.trim();

        if (!name || !email) {
            alert("Please fill in both Name and Email.");
            return;
        }

        const mailtoLink = `mailto:hendry.itbizpro@gmail.com?subject=Exciting%20Career%20Opportunity!!!%20Let's%20connect!!!&body=Name:%20${encodeURIComponent(name)}%0AEmail:%20${encodeURIComponent(email)}%0A%0AMessage:%0A${encodeURIComponent(message)}`;
        window.location.href = mailtoLink;

        // REMOVE WHOLE BUBBLE ⭐
        document.getElementById("intro-bubble").remove();

        addMessage("Hello! I’m here to help you learn more about my work and expertise. <br><br>Could you tell me more about yourself?", "bot")
        addMessage("Email sent", "user");
        typeMessage("Thank you!!! How can I assist you today?", "bot");
    });

    // --- SKIP ---
    skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // REMOVE WHOLE BUBBLE ⭐
        document.getElementById("intro-bubble").remove();

        addMessage("Hello! I’m here to help you learn more about my work and expertise. <br><br>Could you tell me more about yourself?", "bot")
        addMessage("Skipped", "user");
        typeMessage("How can I assist you today?", "bot");
    });
}