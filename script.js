// Initialize variables at the top
let isGeneratingResponse = false;
let userMessage = null;
let GEMINI_API_KEY;
let API_URL;

// Try to get the API key from different sources
async function getApiKey() {
  // For Vercel environment variables (using the _VERCEL_PUBLIC_ prefix)
  if (typeof window !== 'undefined' && window.ENV && window.ENV.GEMINI_API_KEY) {
    return window.ENV.GEMINI_API_KEY;
  }
  
  // For local development
  try {
    const module = await import('./config.js');
    return module.default;
  } catch (e) {
    console.error("Failed to load config file");
    return null;
  }
}

// Initialize the app
async function initializeApp() {
  // Get the API key
  GEMINI_API_KEY = await getApiKey();
  
  if (!GEMINI_API_KEY) {
    console.error("API key not available");
    document.body.innerHTML = "<div style='text-align:center; padding:20px;'><h2>Error: API key not configured</h2><p>Please check the console for more information.</p></div>";
    return;
  }
  
  API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  
  const typingForm = document.querySelector(".input-form");
  const chatList = document.querySelector(".chat-list");
  const suggestions = document.querySelectorAll(".faq-list .faq");
  const deleteChatButton = document.querySelector(".delete-icon");

  // Load saved chats
  const loadLocalStorageData = () => {
    const savedChats = localStorage.getItem("savedChats");
    chatList.innerHTML = savedChats || "";

    document.body.classList.toggle("hide-header", savedChats); 
    if (chatList.scrollHeight > 0) {
      chatList.scrollTo(0, chatList.scrollHeight);
    }
  }

  loadLocalStorageData();

  const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
  }

  const showTypingEffect = (text, element, incomingMessageDiv) => {
    const words = text.split(' ');
    let index = 0;

    const typingInterval = setInterval(() => {
      element.innerText += (index === 0 ? '' : " ") + words[index++];
      const iconElement = incomingMessageDiv.querySelector(".icon");
      if (iconElement) {
        iconElement.classList.add("hide");
      }

      if (index === words.length) {
        clearInterval(typingInterval);
        isGeneratingResponse = false;
        if (iconElement) {
          iconElement.classList.remove("hide");
        }
        localStorage.setItem("savedChats", chatList.innerHTML);
        chatList.scrollTo(0, chatList.scrollHeight);
      }
    }, 75);
  }

  const generateApiResponse = async(incomingMessageDiv) => {
    const textElement = incomingMessageDiv.querySelector(".text");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{text : `You are LuminAI, a friendly and knowledgeable skincare expert assistant. Your purpose is to help users with their skincare concerns and questions. When responding:
                            - For general greetings like "hello", "hi", "how are you", etc., respond in a warm, friendly manner.
                            - For questions about who you are, explain that you're LuminAI, a skincare assistant designed to help with skincare concerns.
                            - For any skincare questions, provide helpful, evidence-based information.
                            - If asked about topics unrelated to skincare (like politics, other health issues, etc.), politely explain that you're specialized in skincare and can't provide advice on other topics.
                            Always maintain a supportive, non-judgmental tone. Personalize your responses when possible, and ask follow-up questions when more information would help provide better advice.
                            The user's message is: ${userMessage}`}]
          }]
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error.message);

      const apiResponse = data?.candidates[0]?.content?.parts[0]?.text?.replace(/\*\*(.*?)\*\*/g,'$1');
      if (apiResponse) {
        showTypingEffect(apiResponse, textElement, incomingMessageDiv);
      } else {
        throw new Error("Invalid response format");
      }
    }
    catch (error) {
      isGeneratingResponse = false;
      textElement.innerText = "Sorry, I couldn't process your request. " + error.message;
      textElement.classList.add("error");
    } finally {
      incomingMessageDiv.classList.remove("loading");
    }
  }

  const showLoadingAnimation = () => {
    const html = `<div class="message-content">
                <img src="./ai avatar.jpeg" alt="bot pic" class="avatar">
                <p class="text">
                </p>
            </div>
            <div class="loading-indicator">
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
                <div class="loading-bar"></div>
            </div>
            <span class="icon">
                <i onclick="copyMessage(this)" class="bi bi-clipboard"></i>
            </span>`;
    const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
    chatList.appendChild(incomingMessageDiv);

    chatList.scrollTo(0, chatList.scrollHeight);
    generateApiResponse(incomingMessageDiv);
  }

  // Define copyMessage in global scope
  window.copyMessage = (copyIcon) => {
    const messageText = copyIcon.parentElement.parentElement.querySelector(".text").innerText;
    navigator.clipboard.writeText(messageText)
      .then(() => {
        copyIcon.classList.remove("bi-clipboard");
        copyIcon.classList.add("bi-check");
        
        setTimeout(() => {
          copyIcon.classList.remove("bi-check");
          copyIcon.classList.add("bi-clipboard");
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  }

  const handleOngoingChat = () => {
    userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage;
    if (!userMessage || isGeneratingResponse) return;

    isGeneratingResponse = true;

    const html = `<div class="message-content">
                    <img src="./user.png" alt="user pic" class="avatar">
                    <p class="text">
                    </p>
                </div>`;
    const outgoingMessageDiv = createMessageElement(html, "outgoing");
    outgoingMessageDiv.querySelector(".text").innerHTML = userMessage;
    chatList.appendChild(outgoingMessageDiv);

    typingForm.reset();
    chatList.scrollTo(0, chatList.scrollHeight);
    document.body.classList.add("hide-header"); 
    setTimeout(() => showLoadingAnimation(), 500);
  }

  suggestions.forEach(suggestion => {
    suggestion.addEventListener("click", () => {
      userMessage = suggestion.querySelector(".text").innerText;
      handleOngoingChat();
    });
  });

  deleteChatButton.addEventListener("click", (e) => {
    if (confirm("Are you sure you want to delete all messages?")) {
      localStorage.removeItem("savedChats");
      loadLocalStorageData();
    }
  });

  typingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleOngoingChat();
  });
}

// Create a simple environment.js file for Vercel deployment
document.addEventListener("DOMContentLoaded", () => {
  // Create environment.js file if it doesn't exist (for Vercel)
  if (!window.ENV) {
    window.ENV = {
      GEMINI_API_KEY: "AIzaSyDashnDPtwtunDcuX_yANNkwGtb1qetmAQ" // Your API key from config.js
    };
  }
  
  // Initialize the app
  initializeApp();
});