
const db = require("../config/db");

const Email = {
  saveEmail: async (emailData) => {
    const query = "INSERT INTO emails (`to`, `subject`, `body`, `status`, `sentAt`) VALUES (?, ?, ?, ?, ?)";
    try {
      const result = await db.query(query, [
        emailData.to,
        emailData.subject,
        emailData.body,
        emailData.status,
        emailData.sentAt,
      ]);
      return result;
    } catch (err) {
      console.error("Error saving email:", err);
      throw err;
    }
  },
};

module.exports = Email;
