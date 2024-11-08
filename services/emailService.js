// const mailchimp = require("@mailchimp/mailchimp_transactional")(process.env.MAILCHIMP_API_KEY);
// const mailgun = require('mailgun-js');
// const Email = require("../models/Email");
// const xlsx = require("xlsx");
// const fs = require("fs");

// const sendSingleEmail = async ({ to, subject, body }) => {
//   try {
//     const message = {
//       from_email: process.env.EMAIL_USER,
//       subject,
//       text: body,
//       to: [{ email: to, type: "to" }],
//     };

//     const response = await mailchimp.messages.send({ message });
//     console.log("Mailchimp Response:", response);

//     const emailData = {
//       to,
//       subject,
//       body,
//       status: "Sent",
//       sentAt: new Date(),
//     };
//     await Email.saveEmail(emailData);

//     return response;
//   } catch (error) {
//     console.error("Error sending email:", error.message);

//     const emailData = {
//       to,
//       subject,
//       body,
//       status: "Failed",
//       sentAt: new Date(),
//     };
//     await Email.saveEmail(emailData);

//     throw new Error(`Failed to send email: ${error.message}`);
//   }
// };

const mailgun = require('mailgun-js');
const Email = require("../models/Email");
const xlsx = require("xlsx");
const fs = require("fs");

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const sendSingleEmail = async ({ to, subject, body }) => {
  try {
    console.log("Sending email to:", to);
    console.log("Using domain:", process.env.MAILGUN_DOMAIN);  
    console.log("API Key:", process.env.MAILGUN_API_KEY ? "Loaded" : "Not loaded"); 

    const message = {
      from: process.env.EMAIL_USER, 
      to,
      subject,
      text: body,
    };

    const response = await mg.messages().send(message);
    console.log("Mailgun Response:", response);

    const emailData = {
      to,
      subject,
      body,
      status: "Sent",
      sentAt: new Date(),
    };
    await Email.saveEmail(emailData);

    return response;
  } catch (error) {
    console.error("Error sending email:", error.message);

    const emailData = {
      to,
      subject,
      body,
      status: "Failed",
      sentAt: new Date(),
    };
    await Email.saveEmail(emailData);

    throw new Error(`Failed to send email: ${error.message}`);
  }
};


// const processExcelFile = (filePath) => {
//   try {
//     const workbook = xlsx.readFile(filePath);
//     const sheet = workbook.Sheets[workbook.SheetNames[0]];
//     const emailData = xlsx.utils.sheet_to_json(sheet);

//     fs.unlinkSync(filePath);

//     const emails = emailData.map((row) => ({
//       to: row.Email,    
//       subject: row.Subject,
//       body: row.Body,
//     }));

//     return emails;
//   } catch (error) {
//     console.error("Error processing Excel file: ", error);
//     throw new Error(`Failed to process Excel file: ${error.message}`);
//   }
// };

const processExcelFile = (filePath) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const emailData = xlsx.utils.sheet_to_json(sheet);

    fs.unlinkSync(filePath); 

    const emails = emailData.map((row) => ({
      to: row.to,
      subject: row.subject,
      body: row.body,
    }));
    console.log(emails)
    return emails;
  } catch (error) {
    console.error("Error processing Excel file: ", error.message);
    throw new Error(`Failed to process Excel file: ${error.message}`);
  }
};

const sendMultipleEmails = async (emails) => {
  for (const email of emails) {
    const data = {
      from: process.env.EMAIL_USER,
      to: email.to,
      subject: email.subject,
      text: email.body,
    };

    try {
      await mg.messages().send(data);
      console.log(`Email sent to ${email.to}`);
    } catch (error) {
      console.error(`Failed to send email to ${email.to}: ${error.message}`);
    }
  }
};


module.exports = {
    sendSingleEmail,
    processExcelFile,
    sendMultipleEmails
}