# LuminAI - Your Personal Skincare Expert

LuminAI is an AI-powered chatbot designed to assist users with their skincare-related queries. It provides guidance on skincare routines, ingredient recommendations, and general skincare tips in an interactive and engaging manner.

## Features

- **Interactive Chatbot:** Users can ask skincare-related questions and receive expert guidance.
- **Predefined FAQs:** Quick access to common skincare concerns.
- **AI-Powered Responses:** Uses the Gemini API to generate responses.
- **Local Storage Support:** Saves chat history for continuity.
- **Aesthetic UI:** Smooth animations and a responsive design.
- **Message Copy Feature:** Easily copy chatbot responses.
- **Delete Chat Option:** Clear previous conversations.

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Frameworks & Libraries:** Bootstrap 5, Bootstrap Icons
- **AI Integration:** Google Gemini API

## Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/luminai.git
   cd luminai
   ```
2. Install dependencies (if applicable).
3. Add your Google Gemini API Key in `config.js`:
   ```js
   const MY_API_KEY = "your_api_key_here";
   ```
4. Open `index.html` in a browser.

## File Structure

```
LuminAI/
│── index.html        # Main HTML file
│── script.js         # JavaScript logic for chatbot interaction
│── styles.css        # Styling for the UI
│── config.js         # API configuration (ensure API key is set)
│── assets/           # Store images, icons, etc.
```

## Usage

1. Open the web application in a browser.
2. Type your skincare question in the input box.
3. Click the send button to receive AI-generated responses.
4. Click on FAQ questions for quick answers.
5. Use the delete button to clear the chat history.

## Screenshots

![image](https://github.com/user-attachments/assets/54e89cf8-3d3a-437b-9768-ed0e1c180456)

## Disclaimer

LuminAI provides general skincare advice. Always consult a dermatologist before making skincare decisions.
