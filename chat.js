// Chat initialization and management
class ChatManager {
    constructor() {
        this.chatHistory = [];
        this.currentUser = null;
        this.isTyping = false;
        this.typingTimeout = null;
        this.init();
    }

    async init() {
        this.loadUserFromURL();
        this.setupEventListeners();
        await this.loadChatHistory();
        this.hideLoadingSpinner();
        this.startAutoUpdates();
        this.updateUIWithUserInfo();
    }

    loadUserFromURL() {
        const params = new URLSearchParams(window.location.search);
        this.currentUser = {
            id: params.get('id') || '1',
            name: params.get('user') || 'Unknown User',
            image: params.get('image') || 'default-avatar.png',
            email: 'user@example.com',
            phone: '+1 234 567 890',
            status: 'Hey there! I am using this chat app.',
            lastSeen: new Date().toISOString()
        };
    }

    updateUIWithUserInfo() {
        // Update chat header
        document.getElementById('chat-user-image').src = this.currentUser.image;
        document.getElementById('chat-user-name').textContent = this.currentUser.name;
        
        // Update profile modal
        document.getElementById('modal-user-image').src = this.currentUser.image;
        document.getElementById('modal-user-name').textContent = this.currentUser.name;
        document.getElementById('modal-user-status').textContent = this.currentUser.status;
        document.getElementById('modal-user-email').textContent = this.currentUser.email;
        document.getElementById('modal-user-phone').textContent = this.currentUser.phone;
        this.updateLastSeen();
    }

    setupEventListeners() {
        // Message input handlers
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-message-btn');
        const attachmentBtn = document.getElementById('attachment-btn');
        const emojiBtn = document.getElementById('emoji-btn');

        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
            this.handleTyping();
        });

        messageInput.addEventListener('input', () => this.handleTyping());
        sendButton.addEventListener('click', () => this.sendMessage());
        attachmentBtn.addEventListener('click', () => this.showModal('attachment-modal'));
        emojiBtn.addEventListener('click', () => this.toggleEmojiPicker());

        // Profile view handler
        document.getElementById('chat-user-image').addEventListener('click', () => this.showModal('profile-modal'));

        // Modal close handlers
        document.querySelectorAll('.modal .close').forEach(button => {
            button.addEventListener('click', () => this.closeModal(button.closest('.modal').id));
        });

        // Handle click outside modal to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
    }

    handleTyping() {
        if (!this.isTyping) {
            this.isTyping = true;
            this.updateTypingStatus(true);
        }

        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            this.isTyping = false;
            this.updateTypingStatus(false);
        }, 1000);
    }

    updateTypingStatus(isTyping) {
        const statusText = document.getElementById('status-text');
        if (isTyping) {
            statusText.textContent = 'Typing...';
        } else {
            this.updateOnlineStatus();
        }
    }

    async loadChatHistory() {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            const history = localStorage.getItem(`chat_${this.currentUser.id}`);
            this.chatHistory = history ? JSON.parse(history) : this.getDefaultChatHistory();
            this.displayMessages();
        } catch (error) {
            console.error('Error loading chat history:', error);
            // Show error message to user
            this.showError('Failed to load chat history');
        }
    }

    getDefaultChatHistory() {
        return [
            {
                type: 'received',
                text: 'Hey! How are you?',
                time: this.formatTime(new Date(Date.now() - 3600000))
            },
            {
                type: 'sent',
                text: 'I\'m good, thanks! How about you?',
                time: this.formatTime(new Date(Date.now() - 3500000))
            }
        ];
    }

    displayMessages() {
        const container = document.getElementById('messages-container');
        container.innerHTML = '';
        
        let lastDate = '';
        
        this.chatHistory.forEach(message => {
            const messageDate = this.getMessageDate(message.time);
            
            if (messageDate !== lastDate) {
                container.appendChild(this.createDateSeparator(messageDate));
                lastDate = messageDate;
            }
            
            container.appendChild(this.createMessageElement(message));
        });
        
        this.scrollToBottom();
    }

    createDateSeparator(date) {
        const div = document.createElement('div');
        div.className = 'date-separator';
        div.textContent = date;
        return div;
    }

    createMessageElement(message) {
        const div = document.createElement('div');
        div.className = `message ${message.type}`;
        
        let content = `
            <div class="message-content">
                <p>${this.formatMessageText(message.text)}</p>
                <span class="time">${message.time}</span>
            </div>
        `;
        
        if (message.type === 'received') {
            content = `
                <img src="${this.currentUser.image}" alt="${this.currentUser.name}" class="message-avatar">
                ${content}
            `;
        }
        
        div.innerHTML = content;
        return div;
    }

    formatMessageText(text) {
        // Convert URLs to links
        text = text.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank">$1</a>'
        );
        
        // Convert emojis
        text = text.replace(/:\)/g, '😊')
                   .replace(/:\(/g, '😢')
                   .replace(/:D/g, '😃');
        
        return text;
    }

    sendMessage() {
        const input = document.getElementById('message-input');
        const message = input.value.trim();
        
        if (message) {
            const newMessage = {
                type: 'sent',
                text: message,
                time: this.formatTime(new Date())
            };
            
            this.chatHistory.push(newMessage);
            this.saveToLocalStorage();
            this.displayMessages();
            input.value = '';
            
            // Simulate received message
            if (Math.random() > 0.5) {
                setTimeout(() => this.simulateResponse(), 1000 + Math.random() * 2000);
            }
        }
    }

    simulateResponse() {
        const responses = [
            "That's interesting!",
            "I see what you mean.",
            "Could you tell me more?",
            "Thanks for sharing!"
        ];
        
        const response = {
            type: 'received',
            text: responses[Math.floor(Math.random() * responses.length)],
            time: this.getCurrentTime()
        };
        
        this.chatHistory.push(response);
        this.saveToLocalStorage();
        this.displayMessages();
    }

    // Utility methods
    getCurrentTime() {
        const now = new Date();
        return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    saveToLocalStorage() {
        localStorage.setItem(
            `chat_${this.currentUser.name}`, 
            JSON.stringify(this.chatHistory)
        );
    }

    scrollToBottom() {
        const container = document.getElementById('messages-container');
        container.scrollTop = container.scrollHeight;
    }

    showModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    hideLoadingSpinner() {
        document.getElementById('message-loading').style.display = 'none';
    }

    startAutoUpdates() {
        setInterval(() => this.updateOnlineStatus(), 30000);
    }

    updateOnlineStatus() {
        const isOnline = Math.random() > 0.3;
        const statusText = document.getElementById('status-text');
        const statusIndicator = document.getElementById('user-online-status');
        
        statusText.textContent = isOnline ? 'Online' : 'Offline';
        statusIndicator.style.backgroundColor = isOnline ? '#2ecc71' : '#95a5a6';
    }

    updateLastSeen() {
        const lastSeenElement = document.getElementById('modal-user-last-seen');
        const lastSeen = new Date(this.currentUser.lastSeen);
        lastSeenElement.textContent = this.formatLastSeen(lastSeen);
    }

    formatLastSeen(date) {
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
        return date.toLocaleDateString();
    }

    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    getMessageDate(time) {
        const date = new Date(time);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString();
    }

    showError(message) {
        // Implement error notification
        alert(message);
    }
}

// Initialize chat when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatManager = new ChatManager();
});

// Global functions for HTML onclick handlers
function viewProfile() {
    window.chatManager.showModal('profile-modal');
}

function closeModal(modalId) {
    window.chatManager.closeModal(modalId);
}

function startCall(type) {
    alert(`Starting ${type} call... (Feature coming soon)`);
}

function showMoreOptions() {
    alert('More options coming soon!');
}

function blockUser() {
    if (confirm('Are you sure you want to block this user?')) {
        alert('User blocked successfully');
        window.location.href = 'index.html';
    }
}

function reportUser() {
    if (confirm('Are you sure you want to report this user?')) {
        alert('User reported successfully');
    }
} 