import React from 'react';
import { Alert, Box, Button, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/SessionContext';
import { useToast } from '../context/ToastContext';
import useFeed from '../hooks/useFeed';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import CreatePostForm from '../components/CreatePostForm';
import PostCard from '../components/PostCard';
import { getErrorMessage } from '../api/client';

function FeedPage() {
    const { currentUser } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const {
        posts,
        loading,
        loadingMore,
        hasMore,
        error,
        toggleLike,
        deletePost,
        reload,
        loadMore,
        bumpCommentCount
    } = useFeed({ infinite: Boolean(currentUser) });

    const sentinelRef = useInfiniteScroll({
        enabled: Boolean(currentUser) && !loading,
        hasMore,
        onLoadMore: loadMore
    });

    const handleLike = async (postId) => {
        if (!currentUser) {
            showToast('Log in to like posts', 'info');
            return;
        }
        try {
            await toggleLike(postId);
        } catch (err) {
            showToast(getErrorMessage(err, 'Could not update like'), 'error');
        }
    };

    const handleDelete = async (postId) => {
        try {
            await deletePost(postId);
        } catch (err) {
            showToast(getErrorMessage(err, 'Could not delete post'), 'error');
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {currentUser && (
                <CreatePostForm onCreated={() => reload({ silent: true })} />
            )}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {posts.length === 0 && <Typography>No posts yet.</Typography>}
            {posts.map((post) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onDelete={handleDelete}
                    onCommentCreated={(postId) => bumpCommentCount(postId, 1)}
                    onNeedAuth={(message) => showToast(message, 'info')}
                />
            ))}
            {currentUser && (hasMore || loadingMore) && (
                <Box
                    ref={sentinelRef}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 2,
                        minHeight: 56
                    }}
                >
                    {loadingMore && (
                        <>
                            <CircularProgress size={28} />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                Loading more...
                            </Typography>
                        </>
                    )}
                </Box>
            )}
            {!currentUser && hasMore && (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                    <Typography sx={{ mb: 1.5 }}>Log in to view more</Typography>
                    <Button variant="contained" onClick={() => navigate('/login')}>
                        Log in
                    </Button>
                </Box>
            )}
            {posts.length > 0 && !hasMore && !loadingMore && (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                    You're all caught up
                </Typography>
            )}
        </Box>
    );
}

export default FeedPage;
