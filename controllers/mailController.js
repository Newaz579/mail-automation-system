const multer = require('multer');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage }).single('file');

exports.uploadFile = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(500).json({ message: 'File upload failed', error: err.message });
        }

        if (!req.file) {
            console.error('No file uploaded');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0]; 
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        console.log('Parsed Excel data:', sheetData);

        res.status(200).json({
            message: 'File uploaded successfully',
            data: sheetData 
        });
    });
};
