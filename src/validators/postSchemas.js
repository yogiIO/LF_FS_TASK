const { z } = require('zod');

const TITLE_MAX = 50;
const CONTENT_MAX = 1000;
const COMMENT_MAX = 500;

function isHttpUrl(value) {
    try {
        const protocol = new URL(value).protocol;
        return protocol === 'https:' || protocol === 'http:';
    } catch {
        return false;
    }
}

const optionalHttpImageUrl = z
    .string()
    .trim()
    .max(255)
    .optional()
    .refine(
        (value) => value === undefined || value === '' || isHttpUrl(value),
        'Image URL must be a valid HTTP or HTTPS URL'
    );

const createPostSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(TITLE_MAX, `Title must be at most ${TITLE_MAX} characters`),
    content: z.string().trim().min(1, 'Content is required').max(CONTENT_MAX, `Content must be at most ${CONTENT_MAX} characters`),
    image_url: optionalHttpImageUrl
});

const createCommentSchema = z.object({
    content: z.string().trim().min(1, 'Content required').max(COMMENT_MAX, `Comment must be at most ${COMMENT_MAX} characters`)
});

const updatePostSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(TITLE_MAX, `Title must be at most ${TITLE_MAX} characters`).optional(),
    content: z.string().trim().min(1, 'Content is required').max(CONTENT_MAX, `Content must be at most ${CONTENT_MAX} characters`).optional()
}).refine((data) => data.title !== undefined || data.content !== undefined, {
    message: 'Nothing to update'
});

module.exports = { createPostSchema, createCommentSchema, updatePostSchema, TITLE_MAX, CONTENT_MAX, COMMENT_MAX };
