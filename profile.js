// Profile data management
let profileData = {
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
    phone: '+1 234 567 890',
    bio: "Hey there! I'm using this chat app.",
    profilePicture: 'pic1.png.jpg',
    chats: [
        { id: 1, name: 'Prashanth', lastMessage: 'Hello, how are you?', time: '12:30', image: 'pic2.png.jpg', unread: 2 },
        { id: 2, name: 'Bhavani', lastMessage: 'See you tomorrow!', time: '11:45', image: 'pic1.png.jpg', unread: 0 },
        { id: 3, name: 'Chandu', lastMessage: 'Thanks!', time: '10:15', image: 'pic3.png.jpg', unread: 1 }
    ],
    groups: [
        { id: 1, name: 'Family Group', members: 5, image: 'group1.jpg' },
        { id: 2, name: 'Work Team', members: 8, image: 'group2.jpg' },
        { id: 3, name: 'Friends Forever', members: 12, image: 'group3.jpg' }
    ],
    messages: []
};

// Initialize profile
document.addEventListener('DOMContentLoaded', function() {
    loadProfileData();
    initializeProfile();
    loadChats();
    loadGroups();
    loadMessages();
});

// Tab switching functionality
function switchTab(tabName) {
    // Hide all content tabs
    document.querySelectorAll('.content-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
}

// Load and display chats
function loadChats() {
    const chatsList = document.getElementById('chats-list');
    chatsList.innerHTML = '';

    profileData.chats.forEach(chat => {
        const chatElement = createChatElement(chat);
        chatsList.appendChild(chatElement);
    });
}

function createChatElement(chat) {
    const div = document.createElement('div');
    div.className = 'list-item chat-item';
    div.onclick = () => openChat(chat.name, chat.image);
    
    div.innerHTML = `
        <img src="${chat.image}" alt="${chat.name}">
        <div class="item-info">
            <h4>${chat.name}</h4>
            <p>${chat.lastMessage}</p>
        </div>
        <div class="item-meta">
            <span class="time">${chat.time}</span>
            ${chat.unread > 0 ? `<span class="unread-badge">${chat.unread}</span>` : ''}
        </div>
    `;
    
    return div;
}

// Load and display groups
function loadGroups() {
    const groupsList = document.getElementById('groups-list');
    groupsList.innerHTML = '';

    profileData.groups.forEach(group => {
        const groupElement = createGroupElement(group);
        groupsList.appendChild(groupElement);
    });
}

function createGroupElement(group) {
    const div = document.createElement('div');
    div.className = 'list-item group-item';
    div.onclick = () => openGroup(group.id);
    
    div.innerHTML = `
        <img src="${group.image}" alt="${group.name}">
        <div class="item-info">
            <h4>${group.name}</h4>
            <p>${group.members} members</p>
        </div>
    `;
    
    return div;
}

// Search functionality
function searchChats(query) {
    const filteredChats = profileData.chats.filter(chat => 
        chat.name.toLowerCase().includes(query.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(query.toLowerCase())
    );
    
    const chatsList = document.getElementById('chats-list');
    chatsList.innerHTML = '';
    filteredChats.forEach(chat => {
        const chatElement = createChatElement(chat);
        chatsList.appendChild(chatElement);
    });
}

function searchGroups(query) {
    const filteredGroups = profileData.groups.filter(group =>
        group.name.toLowerCase().includes(query.toLowerCase())
    );
    
    const groupsList = document.getElementById('groups-list');
    groupsList.innerHTML = '';
    filteredGroups.forEach(group => {
        const groupElement = createGroupElement(group);
        groupsList.appendChild(groupElement);
    });
}

// Profile actions
function openSettings() {
    // Implement settings functionality
    alert('Settings page coming soon!');
}

function openPrivacy() {
    // Implement privacy settings
    alert('Privacy settings coming soon!');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // Implement logout functionality
        window.location.href = 'index.html';
    }
}

function createNewGroup() {
    // Implement group creation
    alert('Group creation coming soon!');
}

// Keep existing profile editing functions... 