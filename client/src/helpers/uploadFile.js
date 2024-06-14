const url = `https://api.cloudinary.com/v1_1/dwuvnodzj/auto/upload`;

const uploadFile = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'chat-app-file');

        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error('Error response from Cloudinary:', errorResponse);
            throw new Error(`Failed to upload file: ${response.statusText}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

export default uploadFile;
