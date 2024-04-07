class Ollama {
    constructor() {
        this.url = 'http://localhost:11434/api/';
        this.chat = null;
        this.model = localStorage.getItem('model') || 'mistral';
        this.models = [];
    }

    setChat(chat) {
        // @Type Chat
        this.chat = chat;
    }

    getModel() {
        return this.model;
    }

    setModel(model) {
        this.model = model;
        localStorage.setItem('model', model);
    }

    _request(method, path, data) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(method, path, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.responseText);
                } else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function() {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send(data);
        });
    }

    _stream(method, path, data) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(method, path, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 3) {
                    resolve(xhr.responseText);
                }
            };
            xhr.onerror = function() {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send(data);
        });
    }

    listModels() {
        let path = this.url + 'tags';
        return this._request('GET', path, null)
            .then((response) => {
                let data = JSON.parse(response);
                let models = [];
                for (let i = 0; i < data.models.length; i++) {
                    let name = data.models[i].name;
                    if (name.endsWith(':latest')) {
                        name = name.slice(0, -7);
                    }
                    models.push(name);
                }
                return models;
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    generate(message) {
        let path = this.url + 'generate';
        let waiting = this.chat.getWaitingMessage();
        if (waiting === null) {
            console.log('No waiting message found');
            this.chat.addMessage('ai');
            waiting = this.chat.getWaitingMessage();
        }
        let instructions = '';
        let data = JSON.stringify({
            model: this.model,
            prompt: instructions + message,
            stream: false
        });
        return this._request('POST', path, data)
            .then((response) => {
                let data = JSON.parse(response);
                let message = data.response;
                this.chat.updateMessage(waiting, message);
            })
            .catch((error) => {
                console.error('Error:', error);
            }).finally(() => {
                document.getElementById('ask').classList.remove('asking');
            });
    }
}