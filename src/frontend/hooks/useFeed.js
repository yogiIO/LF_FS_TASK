import { useCallback, useEffect, useRef, useState } from 'react';
import api, { getErrorMessage } from '../api/client';

const PAGE_SIZE = 20;

function useFeed({ infinite = false } = {}) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState('');
    const pendingLikes = useRef(new Set());
    const pageRef = useRef(1);
    const loadingMoreRef = useRef(false);

    const fetchFeed = useCallback(async ({ silent = false, page = 1, append = false } = {}) => {
        if (append) {
            if (loadingMoreRef.current) return;
            loadingMoreRef.current = true;
            setLoadingMore(true);
        } else if (!silent) {
            setLoading(true);
        }

        try {
            const response = await api.get('/posts', {
                params: { page, limit: PAGE_SIZE }
            });
            const nextPosts = response.data.posts || [];
            const totalPages = Number(response.data.total_pages) || 0;

            setPosts((prev) => (append ? [...prev, ...nextPosts] : nextPosts));
            pageRef.current = page;
            setHasMore(page < totalPages);
            setError('');
        } catch (err) {
            if (!silent && !append) {
                setPosts([]);
            }
            setError(getErrorMessage(err, 'Could not load feed'));
        } finally {
            if (append) {
                loadingMoreRef.current = false;
                setLoadingMore(false);
            } else if (!silent) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        pageRef.current = 1;
        fetchFeed({ page: 1 });
    }, [fetchFeed, infinite]);

    const loadMore = useCallback(async () => {
        if (!infinite || !hasMore) return;
        await fetchFeed({ page: pageRef.current + 1, append: true, silent: true });
    }, [infinite, hasMore, fetchFeed]);

    const reload = useCallback(async ({ silent = false } = {}) => {
        pageRef.current = 1;
        await fetchFeed({ page: 1, silent });
    }, [fetchFeed]);

    const toggleLike = useCallback(async (postId) => {
        if (pendingLikes.current.has(postId)) return;

        const current = posts.find((post) => post.id === postId);
        if (!current) return;

        const nextLiked = !current.liked;
        pendingLikes.current.add(postId);

        setPosts((prev) => prev.map((post) => (
            post.id === postId
                ? {
                    ...post,
                    liked: nextLiked,
                    likes_count: Math.max(0, (post.likes_count || 0) + (nextLiked ? 1 : -1))
                }
                : post
        )));

        try {
            if (nextLiked) {
                await api.post(`/posts/${postId}/like`);
            } else {
                await api.delete(`/posts/${postId}/unlike`);
            }
        } catch (err) {
            setPosts((prev) => prev.map((post) => (
                post.id === postId
                    ? {
                        ...post,
                        liked: current.liked,
                        likes_count: current.likes_count
                    }
                    : post
            )));
            throw err;
        } finally {
            pendingLikes.current.delete(postId);
        }
    }, [posts]);

    const deletePost = useCallback(async (postId) => {
        await api.delete(`/posts/${postId}`);
        setPosts((prev) => prev.filter((post) => post.id !== postId));
    }, []);

    const bumpCommentCount = useCallback((postId, delta = 1) => {
        setPosts((prev) => prev.map((post) => (
            post.id === postId
                ? { ...post, comment_count: Math.max(0, (post.comment_count || 0) + delta) }
                : post
        )));
    }, []);

    return {
        posts,
        loading,
        loadingMore,
        hasMore,
        error,
        setError,
        toggleLike,
        deletePost,
        reload,
        loadMore,
        bumpCommentCount
    };
}

export default useFeed;
