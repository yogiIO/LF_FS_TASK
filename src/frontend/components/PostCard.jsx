import React, { useState } from 'react';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import api, { getErrorMessage } from '../api/client';
import { formatDate } from '../utils/formatDate';
import { useAuth } from '../context/SessionContext';
import { COMMENT_MAX } from '../constants/limits';

function ActionStat({ title, count, onClick, children }) {
    return (
        <Box
            sx={{
                display: 'inline-flex',
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'nowrap',
                gap: '2px',
                height: 28
            }}
        >
            <Tooltip title={title}>
                <IconButton
                    type="button"
                    onClick={onClick}
                    sx={{
                        width: 22,
                        height: 28,
                        p: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    {children}
                </IconButton>
            </Tooltip>
            <Typography
                component="span"
                variant="body2"
                sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    height: 28,
                    lineHeight: '28px',
                    m: 0
                }}
            >
                {count}
            </Typography>
        </Box>
    );
}

function PostCard({ post, onLike, onDelete, onCommentCreated, onNeedAuth }) {
    const { currentUser } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const [pendingCommentLike, setPendingCommentLike] = useState(null);
    const [commentsLoading, setCommentsLoading] = useState(false);

    const isOwner = Number(currentUser?.id) === Number(post.user_id);

    const fetchComments = async () => {
        setCommentsLoading(true);
        try {
            const response = await api.get(`/posts/${post.id}/comments`);
            setComments(response.data);
            setError('');
        } catch (err) {
            setError(getErrorMessage(err, 'Could not load comments'));
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleShowComments = () => {
        const hasComments = (Number(post.comment_count) || 0) > 0 || comments.length > 0;
        if (!currentUser && !hasComments) {
            return;
        }
        if (!showComments && hasComments) {
            fetchComments();
        }
        setShowComments(!showComments);
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;
        try {
            await api.post(`/posts/${post.id}/comments`, { content: newComment.trim() });
            setNewComment('');
            onCommentCreated?.(post.id);
            fetchComments();
        } catch (err) {
            setError(getErrorMessage(err, 'Could not post comment'));
        }
    };

    const handleCommentLike = async (comment) => {
        if (!currentUser) {
            onNeedAuth?.('Log in to like comments');
            return;
        }
        if (pendingCommentLike === comment.id) return;

        const nextLiked = !comment.liked;
        setPendingCommentLike(comment.id);
        setComments((prev) => prev.map((item) => (
            item.id === comment.id
                ? {
                    ...item,
                    liked: nextLiked,
                    likes_count: Math.max(0, (item.likes_count || 0) + (nextLiked ? 1 : -1))
                }
                : item
        )));

        try {
            if (nextLiked) {
                await api.post(`/comments/${comment.id}/like`);
            } else {
                await api.delete(`/comments/${comment.id}/unlike`);
            }
        } catch (err) {
            setComments((prev) => prev.map((item) => (
                item.id === comment.id ? comment : item
            )));
            setError(getErrorMessage(err, 'Could not update comment like'));
        } finally {
            setPendingCommentLike(null);
        }
    };

    return (
        <Card sx={{ mb: 2, borderRadius: '16px' }}>
            <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                    <Avatar src={post.profile_picture_url} alt={post.username}>
                        {(post.username || '?')[0]}
                    </Avatar>
                    <Box>
                        <Typography fontWeight={700} sx={{ lineHeight: 1.2 }}>{post.username}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>
                            {formatDate(post.created_at)}
                        </Typography>
                    </Box>
                </Stack>

                <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mb: 1, overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                >
                    {post.title}
                </Typography>
                <Typography
                    color="text.secondary"
                    sx={{
                        mb: 2,
                        overflowWrap: 'anywhere',
                        wordBreak: 'break-word',
                        maxHeight: 160,
                        overflowY: 'auto',
                        pr: 0.5,
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#c4c9d4 transparent',
                        '&::-webkit-scrollbar': {
                            width: 6
                        },
                        '&::-webkit-scrollbar-track': {
                            background: 'transparent'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: '#c4c9d4',
                            borderRadius: 8
                        }
                    }}
                >
                    {post.content}
                </Typography>

                {post.image_url && (
                    <CardMedia
                        component="img"
                        image={post.image_url}
                        alt=""
                        sx={{ borderRadius: '8px', maxHeight: 360, objectFit: 'cover', mb: 1 }}
                    />
                )}

                <Stack direction="row" spacing={2} alignItems="center">
                    <ActionStat
                        title={post.liked ? 'Unlike' : 'Like'}
                        count={post.likes_count || 0}
                        onClick={() => onLike(post.id)}
                    >
                        {post.liked
                            ? <FavoriteRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />
                            : <FavoriteBorderRoundedIcon sx={{ fontSize: 18, color: 'error.main' }} />}
                    </ActionStat>
                    <ActionStat
                        title="Comments"
                        count={post.comment_count || 0}
                        onClick={handleShowComments}
                    >
                        <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 18 }} />
                    </ActionStat>
                    {isOwner && (
                        <Tooltip title="Delete post">
                            <IconButton
                                type="button"
                                onClick={() => onDelete(post.id)}
                                sx={{ width: 28, height: 28, p: 0 }}
                            >
                                <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Stack>

                {error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}

                {showComments && (currentUser || comments.length > 0) && (
                    <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e5e7eb' }}>
                        {commentsLoading && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                                <CircularProgress size={22} />
                            </Box>
                        )}
                        {comments.map((comment) => (
                            <Stack
                                key={comment.id}
                                direction="row"
                                spacing={1}
                                alignItems="flex-start"
                                sx={{ bgcolor: '#f8fafc', p: 1, borderRadius: '8px', mb: 1 }}
                            >
                                <Avatar src={comment.profile_picture_url} sx={{ width: 24, height: 24, fontSize: 12 }}>
                                    {(comment.username || '?')[0]}
                                </Avatar>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography
                                        component="h5"
                                        sx={{ lineHeight: 1.2, fontSize: 13, fontWeight: 700, m: 0 }}
                                    >
                                        {comment.username}
                                    </Typography>
                                    <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                                        {comment.content}
                                    </Typography>
                                    <ActionStat
                                        title={comment.liked ? 'Unlike' : 'Like comment'}
                                        count={comment.likes_count || 0}
                                        onClick={() => handleCommentLike(comment)}
                                    >
                                        {comment.liked
                                            ? <FavoriteRoundedIcon sx={{ fontSize: 16, color: 'error.main' }} />
                                            : <FavoriteBorderRoundedIcon sx={{ fontSize: 16, color: 'error.main' }} />}
                                    </ActionStat>
                                </Box>
                            </Stack>
                        ))}
                        {currentUser && (
                            <Box component="form" onSubmit={handleAddComment} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Write a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value.slice(0, COMMENT_MAX))}
                                    inputProps={{ maxLength: COMMENT_MAX }}
                                />
                                <Button type="submit" variant="contained">Post</Button>
                            </Box>
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}

export default PostCard;
