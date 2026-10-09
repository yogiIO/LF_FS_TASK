function toPlain(record) {
    if (!record) return {};
    return typeof record.toJSON === 'function' ? record.toJSON() : { ...record };
}

function flattenAuthor(record) {
    const json = toPlain(record);
    const author = json.author || {};

    return {
        ...json,
        username: author.username ?? json.username,
        profile_picture_url: author.profile_picture_url ?? json.profile_picture_url,
        created_at: json.created_at || json.createdAt,
        updated_at: json.updated_at || json.updatedAt
    };
}

function serializeComment(comment) {
    const json = flattenAuthor(comment);
    const liked = Array.isArray(json.likes) ? json.likes.length > 0 : Boolean(json.liked);
    const { author, createdAt, updatedAt, likes, ...rest } = json;
    return { ...rest, liked };
}

function serializePost(post, { includeComments = false } = {}) {
    const json = flattenAuthor(post);
    const nestedComments = json.comments;
    const commentCount = json.comment_count
        ?? (Array.isArray(nestedComments) ? nestedComments.length : undefined);

    const liked = Array.isArray(json.likes) ? json.likes.length > 0 : Boolean(json.liked);
    const { author, createdAt, updatedAt, comments, likes, ...rest } = json;
    const result = { ...rest, liked };

    if (commentCount != null) {
        result.comment_count = commentCount;
    }

    if (includeComments && Array.isArray(nestedComments)) {
        result.comments = nestedComments.map(serializeComment);
    }

    return result;
}

module.exports = { serializePost, serializeComment };
