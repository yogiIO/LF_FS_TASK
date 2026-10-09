const { z } = require('zod');

const emailSchema = z
    .string()
    .trim()
    .min(1, 'Email is required')
    .max(100)
    .email('Invalid email')
    .transform((value) => value.toLowerCase());

const passwordSchema = z.string().max(72, 'Password is too long');

const loginSchema = z.object({
    email: emailSchema,
    password: passwordSchema.min(1, 'Password is required')
});

const registerSchema = z.object({
    username: z.string().trim().min(3).max(50),
    email: emailSchema,
    password: passwordSchema.min(8, 'Password must be at least 8 characters'),
    bio: z.string().max(500).optional()
});

module.exports = { loginSchema, registerSchema };
