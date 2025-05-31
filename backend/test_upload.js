const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');
const path = require('path');

async function testUpload() {
  try {
    // Find an existing image in uploads folder
    const uploadsDir = path.join(__dirname, 'uploads');
    const files = fs.readdirSync(uploadsDir);
    const imageFile = files.find(file => file.endsWith('.png') || file.endsWith('.jpg'));
    
    if (!imageFile) {
      console.log('No image found in uploads folder');
      return;
    }

    console.log(`Testing with image: ${imageFile}`);
    
    const form = new FormData();
    form.append('image', fs.createReadStream(path.join(uploadsDir, imageFile)));

    const response = await axios.post('http://localhost:8000/upload', form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 30000 // 30 second timeout
    });

    console.log('Upload successful:');
    console.log('AI Response:', response.data.aiResponse);
  } catch (error) {
    console.error('Upload failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

console.log('Starting upload test...');
testUpload();
