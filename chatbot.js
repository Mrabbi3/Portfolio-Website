// Chatbot for Portfolio Website
const chatbot = {
    // Configuration
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    apiKey: '', // You'll need to add your API key here
    useLocalOnly: true, // Set to false to use OpenAI API instead of local responses
    
    // State
    isOpen: false,
    messages: [
        { role: 'system', content: `You are a helpful assistant for MD RABBI's portfolio website. 
        Answer questions about MD RABBI, who is a Software Engineer & AI Developer.
        Be friendly, concise, and professional. If you don't know the answer to a question, 
        suggest that the visitor contact MD RABBI directly. Mention that you're an AI assistant.` }
    ],
    
    // Local responses for common questions
    localResponses: [
        {
            keywords: ['hi', 'hello', 'hey', 'greetings'],
            response: "Hello! I'm MD RABBI's AI assistant. How can I help you today?"
        },
        {
            keywords: ['who', 'rabbi', 'about'],
            response: "MD RABBI is a Software Engineer & AI Developer with expertise in web development and AI technologies. He's passionate about building innovative solutions using modern technologies."
        },
        {
            keywords: ['skills', 'technologies', 'tech stack', 'programming'],
            response: "MD RABBI is skilled in HTML5, CSS3, JavaScript, React, Node.js, Java, Python, C++, C#, SQL, Git, GitHub, Machine Learning, and AI technologies."
        },
        {
            keywords: ['contact', 'email', 'reach', 'connect'],
            response: "You can reach out to MD RABBI through the contact form on this website. Alternatively, you can connect with him on LinkedIn at https://www.linkedin.com/in/md-rabbi3/ or check out his GitHub at https://github.com/Mrabbi3."
        },
        {
            keywords: ['projects', 'work', 'portfolio'],
            response: "MD RABBI has worked on various projects including All Matters, a website for children with special needs, and DeathStar 3D, a 3D game using Three.js. You can find more details about his projects on the Projects page."
        },
        {
            keywords: ['education', 'background', 'degree', 'university'],
            response: "For specific details about MD RABBI's educational background, please check his Resume page or contact him directly."
        },
        {
            keywords: ['experience', 'work experience', 'job', 'career'],
            response: "For details about MD RABBI's professional experience, please check his Resume page or reach out to him directly through the contact form."
        },
        {
            keywords: ['resume', 'cv', 'download'],
            response: "You can view MD RABBI's resume on the Resume page of this website."
        },
        {
            keywords: ['thanks', 'thank you', 'thx'],
            response: "You're welcome! If you have any more questions about MD RABBI or his work, feel free to ask. I'm here to help!"
        }
    ],
    
    // DOM elements
    elements: {
        container: null,
        chatIcon: null,
        chatWindow: null,
        messagesContainer: null,
        inputField: null,
        sendButton: null,
    },
    
    // Initialize the chatbot
    init: function() {
        this.createChatbotUI();
        this.setupEventListeners();
        this.addWelcomeMessage();
    },
    
    // Create the chatbot UI
    createChatbotUI: function() {
        // Create main container
        const container = document.createElement('div');
        container.className = 'chatbot-container';
        
        // Create chat icon
        const chatIcon = document.createElement('div');
        chatIcon.className = 'chatbot-icon';
        chatIcon.innerHTML = '<i class="fas fa-comment"></i>';
        
        // Create chat window
        const chatWindow = document.createElement('div');
        chatWindow.className = 'chatbot-window';
        chatWindow.style.display = 'none';
        
        // Create chat header
        const chatHeader = document.createElement('div');
        chatHeader.className = 'chatbot-header';
        chatHeader.innerHTML = `
            <div class="chatbot-title">
                <i class="fas fa-robot"></i>
                <span>MD RABBI's Assistant</span>
            </div>
            <div class="chatbot-close">
                <i class="fas fa-times"></i>
            </div>
        `;
        
        // Create messages container
        const messagesContainer = document.createElement('div');
        messagesContainer.className = 'chatbot-messages';
        
        // Create input area
        const inputArea = document.createElement('div');
        inputArea.className = 'chatbot-input-area';
        
        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.className = 'chatbot-input';
        inputField.placeholder = 'Type your message...';
        
        const sendButton = document.createElement('button');
        sendButton.className = 'chatbot-send';
        sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
        
        // Assemble the components
        inputArea.appendChild(inputField);
        inputArea.appendChild(sendButton);
        
        chatWindow.appendChild(chatHeader);
        chatWindow.appendChild(messagesContainer);
        chatWindow.appendChild(inputArea);
        
        container.appendChild(chatIcon);
        container.appendChild(chatWindow);
        
        // Add to document
        document.body.appendChild(container);
        
        // Store references to DOM elements
        this.elements.container = container;
        this.elements.chatIcon = chatIcon;
        this.elements.chatWindow = chatWindow;
        this.elements.messagesContainer = messagesContainer;
        this.elements.inputField = inputField;
        this.elements.sendButton = sendButton;
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Open/close chat window when icon is clicked
        this.elements.chatIcon.addEventListener('click', () => {
            this.toggleChatWindow();
        });
        
        // Close chat window when close button is clicked
        const closeButton = this.elements.chatWindow.querySelector('.chatbot-close');
        closeButton.addEventListener('click', () => {
            this.toggleChatWindow(false);
        });
        
        // Send message when send button is clicked
        this.elements.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Send message when Enter key is pressed
        this.elements.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    },
    
    // Toggle chat window
    toggleChatWindow: function(forceState) {
        this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
        this.elements.chatWindow.style.display = this.isOpen ? 'flex' : 'none';
        
        // Focus input field when chat window is opened
        if (this.isOpen) {
            setTimeout(() => {
                this.elements.inputField.focus();
            }, 100);
        }
    },
    
    // Add welcome message
    addWelcomeMessage: function() {
        const welcomeMessage = "👋 Hi there! I'm MD RABBI's AI assistant. How can I help you today?";
        this.addMessage('assistant', welcomeMessage);
    },
    
    // Add a message to the chat
    addMessage: function(role, content) {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `chatbot-message ${role}`;
        
        let messageContent = content;
        
        // Add appropriate icon based on role
        if (role === 'user') {
            messageElement.innerHTML = `
                <div class="chatbot-message-content">
                    <p>${messageContent}</p>
                </div>
                <div class="chatbot-avatar">
                    <i class="fas fa-user"></i>
                </div>
            `;
        } else {
            messageElement.innerHTML = `
                <div class="chatbot-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="chatbot-message-content">
                    <p>${messageContent}</p>
                </div>
            `;
        }
        
        // Add message to chat window
        this.elements.messagesContainer.appendChild(messageElement);
        
        // Scroll to bottom of chat
        this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
        
        // Store message in state if it's not a loading message
        if (!messageContent.includes('typing')) {
            this.messages.push({ role, content: messageContent });
        }
    },
    
    // Remove the last message
    removeLastMessage: function() {
        const lastMessage = this.elements.messagesContainer.lastElementChild;
        if (lastMessage) {
            this.elements.messagesContainer.removeChild(lastMessage);
        }
    },
    
    // Get local response based on user input
    getLocalResponse: function(userInput) {
        userInput = userInput.toLowerCase();
        
        // Find matching response based on keywords
        for (const item of this.localResponses) {
            for (const keyword of item.keywords) {
                if (userInput.includes(keyword.toLowerCase())) {
                    return item.response;
                }
            }
        }
        
        // Default response if no match found
        return "I'm not sure I understand. Could you rephrase your question? Alternatively, you can contact MD RABBI directly through the contact form for more specific information.";
    },
    
    // Send message
    sendMessage: async function() {
        const messageText = this.elements.inputField.value.trim();
        
        // Don't send empty messages
        if (messageText === '') {
            return;
        }
        
        // Add user message to chat
        this.addMessage('user', messageText);
        
        // Clear input field
        this.elements.inputField.value = '';
        
        // Add loading message
        this.addMessage('assistant', '<div class="typing-indicator"><span></span><span></span><span></span></div>');
        
        try {
            let response;
            
            // Use local response or API based on configuration
            if (this.useLocalOnly) {
                // Simulate API delay for a more natural experience
                await new Promise(resolve => setTimeout(resolve, 1000));
                response = this.getLocalResponse(messageText);
            } else {
                // Call API to get response
                response = await this.getAIResponse(messageText);
            }
            
            // Remove loading message
            this.removeLastMessage();
            
            // Add AI response to chat
            this.addMessage('assistant', response);
        } catch (error) {
            // Remove loading message
            this.removeLastMessage();
            
            // Add error message to chat
            this.addMessage('assistant', 'Sorry, I encountered an error. Please try again or contact MD RABBI directly.');
            console.error('Chatbot error:', error);
        }
    },
    
    // Get AI response
    getAIResponse: async function(userMessage) {
        // Add user message to messages array
        this.messages.push({ role: 'user', content: userMessage });
        
        // Check if API key is provided
        if (!this.apiKey) {
            return "API key not configured. Please contact the website owner to set up the chatbot properly.";
        }
        
        try {
            // Call OpenAI API
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: this.messages,
                    max_tokens: 500,
                    temperature: 0.7
                })
            });
            
            // Parse response
            const data = await response.json();
            
            // Check for errors
            if (!response.ok) {
                console.error('API error:', data);
                throw new Error(data.error?.message || 'Unknown API error');
            }
            
            // Extract and return assistant's message
            const assistantMessage = data.choices[0].message.content;
            return assistantMessage;
        } catch (error) {
            console.error('API call error:', error);
            throw error;
        }
    }
};

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    chatbot.init();
}); 