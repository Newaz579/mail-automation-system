const multer = require('multer');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const emailService = require("../services/emailService");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage }).single('file');

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



exports.sendSingleEmail = async (req, res) => {
  const { to, subject, body } = req.body;
  try {
    await emailService.sendSingleEmail({ to, subject, body });
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.uploadExcel = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const emails = await emailService.processExcelFile(req.file.path);
    res.status(200).json({ emails, message: "File uploaded and processed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to process file", error: error.message });
  }
};

// exports.uploadExcel = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ message: "No file uploaded" });
//   }

//   try {
//     const emails = await emailService.processExcelFile(req.file.path);
//     res.status(200).json({ emails, message: "File uploaded and processed successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to process file", error: error.message });
//   }
// };

// exports.sendMultipleEmails = async (req, res) => {
//   const { emails } = req.body;

//   if (!emails || emails.length === 0) {
//     return res.status(400).json({ message: "No emails to send" });
//   }

//   try {
//     await emailService.sendMultipleEmails(emails);
//     res.status(200).json({ message: "Emails sent successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to send emails", error: error.message });
//   }
// };
