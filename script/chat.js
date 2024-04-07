class Chat {
    constructor(ollama) {
        this.chat = document.getElementById('chat');
        this.ollama = ollama;
    }

    init() {
        this.clearMessages();
        let aiName = this.ollama.getModel();
        this.aiName = aiName.charAt(0).toUpperCase() + aiName.slice(1);
        this.addMessage('ai', 'Hello! How can I help you today?', true);
    }

    _autoScrollBar(element) {
        let lastMessage = element.querySelectorAll('.chat-container');
        if (lastMessage.length === 0) return;
        lastMessage = lastMessage[lastMessage.length - 1];
        let lastHeight = lastMessage.offsetTop + lastMessage.clientHeight;
        if (lastHeight > window.innerHeight) {
            console.log('Scrolling');
            element.classList.add('scroll');
        } else {
            element.classList.remove('scroll');
        }
    }

    getMessages() {
        let messages = [];
        let chat = this.chat.children;
        for (let i = 0; i < chat.length; i++) {
            let message = chat[i].querySelector('.chat-message').dataset.message;
            if (message !== undefined) {
                messages.push(message);
            }
        }
        return messages;
    }

    clearMessages() {
        while (this.chat.firstChild) {
            this.chat.removeChild(this.chat.firstChild);
        }
        this._autoScrollBar(this.chat);
    }

    removeMessage(element) {
        let parent = null;
        while (element !== null) {
            if (element.classList.contains('chat-container')) {
                parent = element;
                break;
            }
            element = element.parentElement;
        }
        if (parent !== null) {
            this.chat.removeChild(parent);
        }
    }

    addMessage(to, message='', models=false) {
        if (to !== 'user' && to !== 'ai') {
            throw new Error('Invalid value for "to" parameter');
        }
        let isUser = to === 'user';
        let html = document.createDocumentFragment();
        let div = document.createElement('div');
        div.classList.add('chat-container', to);

        // Header
        let header = document.createElement('div');
        header.classList.add('chat-header');
        // Header - Remove
        let remove = document.createElement('div');
        remove.classList.add('chat-header-remove');
        remove.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0,0,256,256">\n' +
            '<g transform="scale(10.66667,10.66667)"><path d="M10,2l-1,1h-5v2h1v15c0,0.52222 0.19133,1.05461 0.56836,1.43164c0.37703,0.37703 0.90942,0.56836 1.43164,0.56836h10c0.52222,0 1.05461,-0.19133 1.43164,-0.56836c0.37703,-0.37703 0.56836,-0.90942 0.56836,-1.43164v-15h1v-2h-5l-1,-1zM7,5h10v15h-10zM9,7v11h2v-11zM13,7v11h2v-11z"></path></g>\n' +
            '</svg>';
        let self = this;
        remove.onclick = function() {
            self.removeMessage(this);
        }
        header.appendChild(remove);
        // Header - Name
        let h1 = document.createElement('h1');
        h1.classList.add('chat-header-title');
        h1.textContent = isUser ? 'You' : this.aiName;
        header.appendChild(h1);
        div.appendChild(header);

        // Content
        let content = document.createElement('div');
        content.classList.add('chat-body');
        // Content - Message
        let divMsg = document.createElement('div');
        divMsg.classList.add('chat-message');
        if (models === false && message !== '') {
            divMsg.dataset.message = message;
        }
        if (message === '') {
            divMsg.classList.add('waiting');
        } else {
            let msgList = message.split('\n');
            let codeBuffer = [];
            let code = false;
            for (let i = 0; i < msgList.length; i++) {
                let msg = msgList[i].trim();
                if (msg.startsWith('```')) {
                    code = !code;
                    if (code === false) {
                        let pMsg = document.createElement('p');
                        pMsg.classList.add('chat-message-text');
                        pMsg.textContent = codeBuffer.join('\n');
                        divMsg.appendChild(pMsg);
                        codeBuffer = [];
                        // Highlight code
                        if (hljs !== undefined) {
                            hljs.highlightElement(pMsg);
                        }
                    }
                    continue;
                }
                if (code) {
                    codeBuffer.push(msg)
                    continue;
                }
                let pMsg = document.createElement('p');
                pMsg.classList.add('chat-message-text');
                pMsg.textContent = msg;
                divMsg.appendChild(pMsg);
            }
        }
        content.appendChild(divMsg);
        // Content - Models
        if (models) {
            let divModels = document.createElement('div');
            divModels.classList.add('chat-models');
            divModels.innerHTML = '<p>Available models:</p>';
            let ul = document.createElement('ul');
            let models = this.ollama.listModels().then((data) => {
                for (let i = 0; i < data.length; i++) {
                    let model = data[i];
                    let li = document.createElement('li');
                    if (model === this.aiName.toLowerCase()) {
                        li.classList.add('selected');
                    }
                    li.textContent = model.charAt(0).toUpperCase() + model.slice(1);
                    li.addEventListener('click', function() {
                        self.ollama.setModel(model);
                        self.init();
                    });
                    ul.appendChild(li);
                }
                divModels.appendChild(ul);
                content.appendChild(divModels);
            });
        }
        div.appendChild(content);
        html.appendChild(div);
        // Append to chat
        this.chat.appendChild(html);
        this._scrollToBottom();
        this._autoScrollBar(this.chat);
    }

    updateMessage(element, message) {
        let msgDiv = null;
        if (element.classList.contains('chat-container')) {
            msgDiv = element.querySelector('.chat-message');
        } else {
            msgDiv = element.parentElement.querySelector('.chat-message');
        }
        msgDiv.classList.remove('waiting');
        msgDiv.dataset.message = message;
        while (msgDiv.firstChild) {
            msgDiv.removeChild(msgDiv.firstChild);
        }
        let msgList = message.split('\n');
        let codeBuffer = [];
        let code = false;
        for (let i = 0; i < msgList.length; i++) {
            let msg = msgList[i].trim();
            if (msg.startsWith('```')) {
                code = !code;
                if (code === false) {
                    let pMsg = document.createElement('pre');
                    pMsg.classList.add('chat-message-text');
                    pMsg.textContent = codeBuffer.join('\n');
                    msgDiv.appendChild(pMsg);
                    codeBuffer = [];
                    // Highlight code
                    if (hljs !== undefined) {
                        hljs.highlightElement(pMsg);
                    }
                }
                continue;
            }
            if (code) {
                codeBuffer.push(msg)
                continue;
            }
            let pMsg = document.createElement('p');
            pMsg.classList.add('chat-message-text');
            pMsg.textContent = msgList[i];
            msgDiv.appendChild(pMsg);
        }
        this._scrollToBottom();
        this._autoScrollBar(this.chat);
    }

    getWaitingMessage() {
        let messages = this.chat.querySelectorAll('.chat-message.waiting');
        if (messages.length > 0) {
            return messages[0];
        }
        return null;
    }

    _scrollToBottom() {
        this.chat.scrollIntoView(false);
    }
}
