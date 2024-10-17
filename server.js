const express = require('express');
const mailRoutes = require('./routes/mailRoutes');
const cors = require('cors');
const app = express();
const port = 5000;
app.use(cors())
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api/mail', mailRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
