// Chatbot for Portfolio Website
const chatbot = {
    // Configuration
    apiEndpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    apiKey: '', // <-- Insert your OpenAI API key here or use a secure environment variable in production
    useLocalOnly: false, // Set to true to use local responses instead of ChatGPT API
    maxTokens: 500,
    temperature: 0.7,
    maxConversationLength: 10, // Maximum number of messages to keep in context
    
    // State
    isOpen: false,
    messages: [
        { 
            role: 'system', 
            content: `You are MD RABBI's intelligent AI assistant on his portfolio website. 

ABOUT MD RABBI:
- Software Engineer & AI Developer
- Passionate computer science student interested in AI, Machine Learning, and software development
- Skills: HTML5, CSS3, JavaScript, React, Node.js, Java, Python, C++, C#, SQL, Git, GitHub, LLM, ML, AI
- Looking for internship opportunities to gain more experience
- Projects include: All Matters (website for children with special needs), DeathStar 3D (3D game using Three.js)
- Contact: LinkedIn (https://www.linkedin.com/in/md-rabbi3/), GitHub (https://github.com/Mrabbi3), YouTube (@FLOCKY144)

INSTRUCTIONS:
- Be friendly, professional, and concise
- Answer questions about MD RABBI's background, skills, projects, and experience
- If asked about specific details not provided, suggest contacting MD RABBI directly
- Always mention you're an AI assistant when introducing yourself
- Help visitors navigate the website and understand MD RABBI's work
- Be encouraging about MD RABBI's career goals and internship search
- Keep responses under 100 words unless more detail is specifically requested` 
        }
    ],
    conversationHistory: [], // Separate array to track full conversation for context
    
    // Local responses for common questions (fallback when API is unavailable)
    localResponses: [
        {
            keywords: ['hi', 'hello', 'hey', 'greetings'],
            response: "Hello! I'm MD RABBI's AI assistant. How can I help you today? 🤖"
        },
        {
            keywords: ['who', 'rabbi', 'about'],
            response: "MD RABBI is a Software Engineer & AI Developer with expertise in web development and AI technologies. He's a passionate computer science student currently seeking internship opportunities to further develop his skills."
        },
        {
            keywords: ['skills', 'technologies', 'tech stack', 'programming'],
            response: "MD RABBI is skilled in HTML5, CSS3, JavaScript, React, Node.js, Java, Python, C++, C#, SQL, Git, GitHub, Machine Learning, and AI technologies. He's particularly passionate about AI and web development."
        },
        {
            keywords: ['contact', 'email', 'reach', 'connect'],
            response: "You can reach MD RABBI through the contact form on this website, connect on LinkedIn (https://www.linkedin.com/in/md-rabbi3/), or check out his GitHub (https://github.com/Mrabbi3)."
        },
        {
            keywords: ['projects', 'work', 'portfolio'],
            response: "MD RABBI has worked on projects like All Matters (a website for children with special needs) and DeathStar 3D (a 3D game using Three.js). Check out the Projects page for more details!"
        },
        {
            keywords: ['education', 'background', 'degree', 'university'],
            response: "For specific details about MD RABBI's educational background, please check his Resume page or contact him directly."
        },
        {
            keywords: ['internship', 'job', 'career', 'opportunity'],
            response: "MD RABBI is actively seeking internship opportunities to gain more experience in software engineering and AI development. Feel free to reach out through the contact form if you have opportunities!"
        },
        {
            keywords: ['resume', 'cv', 'download'],
            response: "You can view MD RABBI's resume on the Resume page of this website."
        },
        {
            keywords: ['thanks', 'thank you', 'thx'],
            response: "You're welcome! If you have any more questions about MD RABBI or his work, feel free to ask. I'm here to help! 🤖"
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
    
    // Send message with enhanced error handling
    sendMessage: async function() {
        const messageText = this.elements.inputField.value.trim();
        
        // Don't send empty messages
        if (messageText === '') {
            return;
        }
        
        // Disable input while processing
        this.elements.inputField.disabled = true;
        this.elements.sendButton.disabled = true;
        
        // Add user message to chat
        this.addMessage('user', messageText);
        
        // Clear input field
        this.elements.inputField.value = '';
        
        // Add loading message
        this.addMessage('assistant', '<div class="typing-indicator"><span></span><span></span><span></span></div>');
        
        try {
            let response;
            
            // Use local response or ChatGPT API based on configuration
            if (this.useLocalOnly) {
                // Simulate API delay for a more natural experience
                await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
                response = this.getLocalResponse(messageText);
            } else {
                // Call ChatGPT API to get response
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
            this.addMessage('assistant', 'Sorry, I encountered an error while processing your request. Please try again or contact MD RABBI directly through the contact form.');
            console.error('Chatbot error:', error);
        } finally {
            // Re-enable input
            this.elements.inputField.disabled = false;
            this.elements.sendButton.disabled = false;
            this.elements.inputField.focus();
        }
    },
    
    // Get AI response with enhanced error handling and context management
    getAIResponse: async function(userMessage) {
        // Add user message to conversation history
        this.conversationHistory.push({ role: 'user', content: userMessage });
        
        // Manage conversation length to stay within token limits
        this.manageConversationContext();
        
        // Check if API key is provided
        if (!this.apiKey || this.apiKey.trim() === '') {
            return "ChatGPT API key not configured. Please add your API key to enable AI responses, or I can help with basic questions using my local knowledge base.";
        }
        
        try {
            // Prepare messages for API call (system message + recent conversation)
            const apiMessages = [
                this.messages[0], // System message
                ...this.conversationHistory.slice(-this.maxConversationLength)
            ];
            
            // Call ChatGPT API
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: apiMessages,
                    max_tokens: this.maxTokens,
                    temperature: this.temperature,
                    presence_penalty: 0.1,
                    frequency_penalty: 0.1
                })
            });
            
            // Parse response
            const data = await response.json();
            
            // Handle API errors
            if (!response.ok) {
                console.error('ChatGPT API error:', data);
                
                // Handle specific error types
                if (response.status === 401) {
                    return "Invalid API key. Please check your ChatGPT API key configuration.";
                } else if (response.status === 429) {
                    return "API rate limit exceeded. Please try again in a moment.";
                } else if (response.status === 500) {
                    return "ChatGPT service is temporarily unavailable. Let me help with local responses instead.";
                }
                
                throw new Error(data.error?.message || `API error: ${response.status}`);
            }
            
            // Extract assistant's message
            const assistantMessage = data.choices[0].message.content;
            
            // Add assistant's response to conversation history
            this.conversationHistory.push({ role: 'assistant', content: assistantMessage });
            
            return assistantMessage;
            
        } catch (error) {
            console.error('ChatGPT API call error:', error);
            
            // Fallback to local response if API fails
            console.log('Falling back to local responses...');
            return this.getLocalResponse(userMessage) + " (Note: AI assistant is temporarily unavailable)";
        }
    },
    
    // Manage conversation context to stay within token limits
    manageConversationContext: function() {
        // Keep only the most recent messages to manage token usage
        if (this.conversationHistory.length > this.maxConversationLength) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxConversationLength);
        }
    },
    
    // Clear conversation history (useful for starting fresh)
    clearConversation: function() {
        this.conversationHistory = [];
        console.log('Conversation history cleared');
    },
    
    // Get conversation statistics
    getConversationStats: function() {
        return {
            totalMessages: this.conversationHistory.length,
            apiKeyConfigured: this.apiKey && this.apiKey.trim() !== '',
            usingLocalOnly: this.useLocalOnly,
            model: this.model
        };
    },
    
    // Test API connection (for debugging)
    testAPIConnection: async function() {
        console.log('🧪 Testing ChatGPT API connection...');
        console.log('API Key configured:', this.apiKey ? 'Yes' : 'No');
        console.log('Using local only:', this.useLocalOnly);
        
        if (!this.apiKey || this.apiKey.trim() === '') {
            console.log('❌ No API key configured');
            return false;
        }
        
        try {
            const testResponse = await this.getAIResponse('Hello, can you hear me?');
            console.log('✅ API Test Response:', testResponse);
            return true;
        } catch (error) {
            console.log('❌ API Test Failed:', error);
            return false;
        }
    }
};

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    chatbot.init();
}); 

chatbot.testAPIConnection()