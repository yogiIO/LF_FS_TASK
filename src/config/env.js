require('dotenv').config();

function integer(name, fallback) {
    const parsed = Number.parseInt(process.env[name], 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function list(name, fallback) {
    const raw = process.env[name] || fallback;
    return raw.split(',').map((value) => value.trim()).filter(Boolean);
}

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT_SECRET is not set');
}

const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    port: integer('PORT', 3000),
    db: {
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: integer('DB_PORT', 3306)
    },
    jwtSecret,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    accessTokenMaxAgeMs: integer('ACCESS_TOKEN_MAX_AGE_MS', 7 * 24 * 60 * 60 * 1000),
    bcryptSaltRounds: integer('BCRYPT_SALT_ROUNDS', 10),
    corsOrigins: list('CORS_ORIGIN', 'http://localhost:5173')
};

module.exports = env;
