import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

// Python Service URL
const AI_SERVICE_URL = 'http://localhost:8000';

// @desc    Upload video for analysis
// @route   POST /api/analysis/upload
export const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // Forward to Python Service
        // We need to read the file from req.file.path (multer saves it locally first)
        // or stream it. 
        // Assuming backend uses multer and saves to 'uploads/' or similar temp dir.
        // If we use memory storage, req.file.buffer exists.

        // For this implementation, we'll assume the Python service is accessible 
        // and we just proxy the request.

        const formData = new FormData();
        formData.append('file', fs.createReadStream(req.file.path));

        const response = await axios.post(`${AI_SERVICE_URL}/video-analysis/upload`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
        });

        // After upload, trigger analysis
        const filename = response.data.filename;
        const analysisResponse = await axios.post(`${AI_SERVICE_URL}/video-analysis/analyze/${filename}`);

        // Return the analysis results to the frontend
        res.status(200).json(analysisResponse.data);

        // Cleanup: Delete temp file if needed
        fs.unlinkSync(req.file.path);

    } catch (error) {
        console.error('Error in video analysis proxy:', error.message);
        res.status(500).json({ message: 'Analysis failed.', error: error.message });
    }
};
