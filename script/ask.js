class Ask {
    constructor(chat, ollama) {
        // @Type Chat
        this.chat = chat;
        this.ask = document.getElementById('ask');
        this.ollama = ollama;
    }

    init() {
        let self = this;
        this.ask.onsubmit = function(event) {
            event.preventDefault();
            self.askQuestion();
        };
        this.ask.querySelector('textarea').oninput = function(e) {
            self._autoGrow(this);
        };
        // If keys are Ctrl + Enter, then submit the form
        window.onkeydown = function(event) {
            if (event.ctrlKey && event.key === 'Enter') {
                self.askQuestion();
            }
        }
    }

    _autoGrow(element) {
        element.style.height = '5px';
        element.style.height = (element.scrollHeight) + 'px';
    }

    isAsking() {
        return this.ask.classList.contains('asking');
    }

    askQuestion() {
        let input = this.ask.querySelector('textarea');
        let message = input.value.trim();
        if (message === '') {
            return;
        }
        if (this.isAsking()) {
            console.log('Already asking a question');
            return;
        }
        input.value = '';
        this._autoGrow(input);
        this.ask.classList.add('asking');
        this.chat.addMessage('user', message);
        this.chat.addMessage('ai');
        let history = this.chat.getMessages();
        history.pop();
        if (history.length > 0) {
            message += '\n\n---History---\n';
            let even = false;
            for (let i = history.length - 1; i >= 0; i--) {
                if (even) {
                    message += 'A: ' + history[i] + '\n';
                } else {
                    message += 'Q: ' + history[i] + '\n';
                }
                even = !even;
            }
        }
        console.log(history);
        this.ollama.generate(message);
    }
}