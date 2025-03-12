# Chatbot Rival - User Interaction Edition

**Chatbot Rival - User Interaction Edition** is a variant of the original [Chatbot Rival](https://github.com/Raytengo/Chatbot-Rival) project. This version enhances user interaction by allowing them to directly converse with the AI chatbots while retaining the original functionality to customize the world settings. In another word, this version allow you to talk to AI.

## Features ✨

- **User Interaction with AI**:
  - Users can now engage in direct conversations with the AI agents, rather than just watching them interact with each other.
  
- **Customizable World Settings**:
  - Set the context of the conversation by defining the world settings. This allows for unique and varied interactions based on different scenarios.
  
- **Real-time Interaction**:
  - Experience the conversation live with real-time updates and dynamic interaction between the user and the AI agents.
  
- **Adjustable AI Personalities**:
  - Modify the personalities of the AI agents through configuration settings to influence the tone and style of the conversation.

## How It Works ⚙️

1. **Frontend**:
   - The user communicates with the AI models via an interactive browser interface that displays real-time messages and updates.

2. **Backend**:
   - Flask handles the communication between the frontend and the AI models, fetching responses and updating the conversation dynamically.

3. **AI Models**:
   - The conversation is powered by AI models like `grok-2-latest`, and users can choose between different models to tailor the interaction.

4. **World Settings**:
   - Users can adjust the world settings, which changes the context and environment of the conversation. This feature adds flexibility and makes the interaction more immersive.

## Differences from the Original Project

- **User Interaction**: In the original project, two AI agents conversed with each other. In this version, users can now directly interact with the AI agents, making the experience more engaging.
  
- **World Settings**: Like the original project, the world settings feature is preserved, allowing users to define the context of the conversation, which adds a unique layer to the interaction.


## File Overview 📂

- **`chat.js`**: 
  - Handles the frontend logic for managing conversation and updating the UI.
  
- **`style.css`**:
  - Styles the chat interface to ensure a visually appealing user experience.
  
- **`config.py`**:
  - Contains all the global configuration settings, such as the default AI models, conversation settings, and world configurations.
  
- **`model_loader.py`**:
  - Loads the selected AI model and fetches responses from the backend.

- **`server.py`**:
  - The Flask server managing routes and interactions between the frontend and backend.

- **`setting.py`**:
  - Defines the personalities for the AI agents.

- **`index.html`**:
  - The main HTML page that renders the chat interface in the browser.

