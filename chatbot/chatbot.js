// --- Load chatbot elements and knowledgebase ---
const messagesContainer = document.getElementById('chatbot-messages');
const inputField = document.getElementById('chatbot-input');
const header = document.getElementById('chatbot-header');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotBubble = document.getElementById('chatbot-bubble');
const knowledgebase_url = "https://profile-hendry.s3.us-west-1.amazonaws.com/knowledgebase.csv";
const contactKeywords = ['contact', 'reach out', 'get in touch', 'connect'];

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

        // --- Auto-skip the form if it's open ---
        autoSkipForm();

        const userText = inputField.value.trim();
        addMessage(userText, 'user');
        inputField.value = '';

        // --- Check if input includes contact keywords ---
        const lowerText = userText.toLowerCase();
        const wantsContact = contactKeywords.some(keyword => lowerText.includes(keyword));

        if (wantsContact) {
            showIntroForm("Please call me at <a href='tel:6692389972'><br>(669)238-9972</a> or <br>send email to <br><a href='mailto:hendry.itbizpro@gmail.com'>hendry.itbizpro@gmail.com</a> or <br>fill in the following form:");  // Display the form again
            return;           // Stop further response for now
        }

        const botReply = getResponse(userText);

        // delay before bot starts typing
        setTimeout(async () => {
            removeTypingIndicator();
            await typeMessage(botReply, 'bot');
        }, 600);
    }
});

document.getElementById("contact-btn").addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    // Remove any previously opened form
    const oldForm = document.getElementById("intro-bubble");
    if (oldForm) oldForm.remove();

    // Open chatbox
    isOpen = true;
    chatbotContainer.style.display = 'flex';
    chatbotBubble.style.display = 'none';

    // Show form
    showIntroForm(
        "Please fill out your details and I will get back to you shortly:"
    );

    greeted = true; // prevent default greeting from firing later
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
        // allow flexible match: thank, thanks, sponsorship, sponsoring, etc.
        const regex = new RegExp(entry.keyword.toLowerCase(), "i");

        if (regex.test(lower)) {
            if (entry.answer && entry.answer.trim().length > 0) {
                return entry.answer;
            }
        }
    }

    return "I’m not able to provide that information at this moment. Please call <a href='tel:6692389972'>(669)238-9972</a> or <br> email to <a href='mailto:hendry.itbizpro@gmail.com'>hendry.itbizpro@gmail.com</a> for more details.";
}

function isValidEmail(email) {
    // Basic but reliable email format check
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function autoSkipForm(promtText) {
    const introBubble = document.getElementById("intro-bubble");
    if (introBubble) {
        introBubble.remove();
        addMessage("How can I assist you today?", "bot");
    }
}

// --- Function to get information about the visitor ---
function showIntroForm(promptText = "Hello! I’m here to help you learn more about my work and expertise. <br><br>Could you tell me more about yourself?") {
    const bubbleWrapper = document.createElement("div");
    bubbleWrapper.classList.add("chatbot-message", "bot");
    bubbleWrapper.id = "intro-bubble";
    messagesContainer.appendChild(bubbleWrapper);

    const formHtml = `
        <div id="intro-form" style="display: flex; flex-direction: column; gap: 10px; padding: 10px; box-sizing: border-box; width: 100%;">
            <p style="margin: 0 0 5px 0; font-weight: 500;">
                ${promptText}
            </p>
            <input type="text" id="user-name" placeholder="Your Name" required
                style="padding: 10px; border-radius: 5px; border: 1px solid #ccc; width: calc(100% - 20px); font-size: 14px; box-sizing: border-box;">
            <input type="email" id="user-email" placeholder="Your Email" required
                style="padding: 10px; border-radius: 5px; border: 1px solid #ccc; width: calc(100% - 20px); font-size: 14px; box-sizing: border-box;">
            <textarea id="user-message" placeholder="Your Message (optional)"
                style="padding: 10px; border-radius: 5px; border: 1px solid #ccc; width: calc(100% - 20px); font-size: 14px; resize: vertical; min-height: 60px; box-sizing: border-box;"></textarea>
            <div id="form-error" style="color: red; font-size: 13px;"></div>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="skip-btn" style="padding: 8px 16px; background-color: #f0f0f0; border: none; border-radius: 5px; cursor: pointer; font-weight: 500;">Skip</button>
                <button id="send-btn" style="padding: 8px 16px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: 500;">Send</button>
            </div>
        </div>
    `;
    
    bubbleWrapper.innerHTML = formHtml;

    // Prevent close-on-click
    bubbleWrapper.addEventListener('click', e => e.stopPropagation());

    // Auto-focus the Name field
    setTimeout(() => {
        const nameField = document.getElementById("user-name");
        if (nameField) nameField.focus();
    }, 50);


    const sendBtn = bubbleWrapper.querySelector("#send-btn");
    const skipBtn = bubbleWrapper.querySelector("#skip-btn");

    // --- SEND ---
    sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const name = document.getElementById('user-name').value.trim();
        const email = document.getElementById('user-email').value.trim();
        const message = document.getElementById('user-message').value.trim();

        // Validate Input
        const errorBox = document.getElementById("form-error");
        errorBox.textContent = ""; // clear previous errors

        if (!name || !email) {
            errorBox.textContent = "Please fill in both Name and Email.";
            return;
        }

        if (!isValidEmail(email)) {
            errorBox.textContent = "Please enter a valid email address.";
            return;
        }

        // EmailJS sending
        emailjs.send("service_m6xi1so", "template_6wzitzb", {
            name: name,
            email: email,
            message: message,
            subject: "Exciting Career Opportunity!!! Let's Connect!!!"
        })
        .then(() => {

            // REMOVE WHOLE BUBBLE ⭐
            document.getElementById("intro-bubble").remove();

            addMessage(promptText, "bot")
            addMessage("Email sent", "user");
            typeMessage("Thank you!!! How can I assist you today?", "bot");
        })
        .catch((err) => {
            console.error(err);
            alert("Failed to send email. Please try again.");
        });
    });

    // --- SKIP ---
    skipBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // REMOVE WHOLE BUBBLE ⭐
        document.getElementById("intro-bubble").remove();

        addMessage(promptText, "bot")
        addMessage("Skipped", "user");
        typeMessage("How can I assist you today?", "bot");
    });
}