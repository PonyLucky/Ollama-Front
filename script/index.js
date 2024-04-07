// Document load event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize ollama
    let ollama = new Ollama();
    // Initialize the chat
    let chat = new Chat(ollama);
    chat.init();
    // Set the chat to ollama
    ollama.setChat(chat);
    // Initialize the ask
    let ask = new Ask(chat, ollama);
    ask.init();
});

// TODO: implement stream
