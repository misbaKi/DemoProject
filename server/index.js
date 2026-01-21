const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const trialRoutes = require('./routes/trials');
const participantRoutes = require('./routes/participants');
const reportRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/trials', trialRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => {
    res.send('CTMS Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
