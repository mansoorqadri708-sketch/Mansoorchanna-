const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    createParentPath: true,
    limits: { 
        fileSize: 50 * 1024 * 1024 // 50MB max file size
    },
    abortOnLimit: true
}));

// Serve static files
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Set view engine
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', path.join(__dirname, 'views'));

// Home page - displays upload form and gallery
app.get('/', (req, res) => {
    // Read all uploaded files
    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Error reading uploads:', err);
            return res.render('index.html', { files: [] });
        }
        
        // Filter and organize files by type
        const mediaFiles = files.map(filename => {
            const filePath = path.join(uploadDir, filename);
            const stats = fs.statSync(filePath);
            const ext = path.extname(filename).toLowerCase();
            const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
            const isVideo = ['.mp4', '.webm', '.ogg', '.mov'].includes(ext);
            
            return {
                name: filename,
                url: `/uploads/${filename}`,
                type: isImage ? 'image' : (isVideo ? 'video' : 'other'),
                size: stats.size,
                uploadedAt: stats.birthtime
            };
        }).filter(file => file.type !== 'other'); // Only show images and videos
        
        res.render('index.html', { files: mediaFiles });
    });
});

// Handle file upload
app.post('/upload', async (req, res) => {
    try {
        if (!req.files || !req.files.media) {
            return res.status(400).json({ error: 'No files were uploaded' });
        }

        const uploadedFile = req.files.media;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 
                             'video/mp4', 'video/webm', 'video/ogg'];
        
        // Validate file type
        if (!allowedTypes.includes(uploadedFile.mimetype)) {
            return res.status(400).json({ 
                error: 'Invalid file type. Only images and videos are allowed.' 
            });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}-${uploadedFile.name.replace(/\s/g, '_')}`;
        const uploadPath = path.join(uploadDir, uniqueFilename);

        // Move file to uploads directory
        await uploadedFile.mv(uploadPath);
        
        console.log(`File uploaded successfully: ${uniqueFilename}`);
        res.json({ 
            success: true, 
            message: 'File uploaded successfully',
            filename: uniqueFilename,
            url: `/uploads/${uniqueFilename}`
        });

    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});