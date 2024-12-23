class ProfilePhotoHandler {
    constructor() {
        this.supportedTypes = ['pic1.png.jpg', 'pic2.png.jpg', 'pic3.png.jpg'];
        this.maxSize = 5 * 1024 * 1024; // 5MB
    }

    validateFile(file) {
        if (!file) return { valid: false, error: 'No file selected' };
        
        if (!this.supportedTypes.includes(file.type)) {
            return { valid: false, error: 'Unsupported file type' };
        }
        
        if (file.size > this.maxSize) {
            return { valid: false, error: 'File size too large (max 5MB)' };
        }

        return { valid: true };
    }

    async compressImage(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    // Max dimensions
                    const MAX_WIDTH = 800;
                    const MAX_HEIGHT = 800;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // Get compressed image data
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/jpeg', 0.7);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    async saveProfilePicture(file) {
        const validation = this.validateFile(file);
        if (!validation.valid) {
            alert(validation.error);
            return null;
        }

        try {
            const compressedImage = await this.compressImage(file);
            const imageUrl = URL.createObjectURL(compressedImage);
            
            // Save to localStorage (in real app, you'd save to server)
            localStorage.setItem('profilePicture', imageUrl);
            
            return imageUrl;
        } catch (error) {
            console.error('Error processing image:', error);
            alert('Error processing image');
            return null;
        }
    }

    loadProfilePicture() {
        return localStorage.getItem('profilePicture') || 'pic2.png.jpg';
    }
}

// Export for use in other files
window.ProfilePhotoHandler = ProfilePhotoHandler; 