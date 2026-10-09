const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const env = require('./src/config/env');
const { sequelize } = require('./src/models');
const apiRoutes = require('./src/routes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: env.corsOrigins,
    credentials: true
}));

sequelize.authenticate()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection failed:', err));

app.use('/api', apiRoutes);
app.use(errorHandler);

sequelize.sync({ alter: false })
    .then(() => {
        app.listen(env.port, () => {
            console.log(`✓ Server running on http://localhost:${env.port}`);
        });
    })
    .catch(err => {
        console.error('✗ Failed to sync database:', err);
    });

module.exports = app;
