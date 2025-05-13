# MD RABBI's Portfolio Website

A professional portfolio website showcasing MD RABBI's skills, projects, and experience as a Software Engineer & AI Developer.

## Features

- Responsive design that works on all devices
- Interactive UI with smooth animations
- Project showcase with filtering
- Timeline of professional journey
- Contact form for inquiries
- AI Chatbot for visitor assistance

## AI Chatbot

The website includes an AI-powered chatbot that can help visitors by answering questions about MD RABBI's skills, experience, projects, and more. The chatbot can operate in two modes:

### Local-Only Mode (Default)

By default, the chatbot operates in "local-only" mode, which uses predefined responses to common questions without requiring an API key. This is the most cost-effective option as it doesn't require any external API calls.

### OpenAI API Mode

For more dynamic responses, the chatbot can be configured to use OpenAI's GPT model. To enable this mode:

1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Open the `chatbot.js` file
3. Replace the empty string in `apiKey: ''` with your actual API key
4. Change `useLocalOnly: true` to `useLocalOnly: false`

**Note:** Using the OpenAI API will incur charges based on your usage. Make sure you understand OpenAI's pricing before enabling this mode.

## Customizing the Chatbot

### Modifying Local Responses

You can edit the predefined responses in `chatbot.js` by modifying the `localResponses` array. Each response object has two properties:

- `keywords`: An array of words that trigger this response
- `response`: The text that the chatbot will reply with

### Changing the System Prompt

To modify how the OpenAI-powered chatbot responds, edit the system prompt in the `messages` array at the beginning of the `chatbot.js` file.

## Security Considerations

If you choose to use the OpenAI API mode:

- Never commit your API key to a public repository
- Consider using environment variables or a backend service to securely store and manage your API key
- Implement rate limiting to prevent excessive API usage

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Font Awesome for icons
- OpenAI API (optional)

## Setup and Installation

1. Clone this repository
2. Open any of the HTML files in a web browser
3. To enable the OpenAI API mode, follow the instructions above 