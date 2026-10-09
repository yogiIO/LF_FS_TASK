const { z } = require('zod');

const TITLE_MAX = 50;
const CONTENT_MAX = 1000;
const COMMENT_MAX = 500;

const createPostSchema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(TITLE_MAX, `Title must be at most ${TITLE_MAX} characters`),
    content: z.string().trim().min(1, 'Content is required').max(CONTENT_MAX, `Content must be at most ${CONTENT_MAX} characters`),
    image_url: z.string().max(255).optional()
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
