const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { sequelize } = require('./src/models');
const apiRoutes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection failed:', err));

app.use('/api', apiRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✓ Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('✗ Failed to sync database:', err);
    });

module.exports = app;
