function errorHandler(err, req, res, next) {
    console.error('Error:', err);

    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ error: 'Already exists' });
    }

    if (err.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({ error: 'Invalid reference' });
    }

    const status = err.status || 500;
    const isServerError = status >= 500;

    res.status(status).json({
        error: isServerError ? 'Internal server error' : (err.message || 'Request failed')
    });
}

module.exports = errorHandler;
