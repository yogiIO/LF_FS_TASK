import React, { useEffect, useState } from 'react';
import { Alert, Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import api, { getErrorMessage } from '../api/client';

function TrendingPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const response = await api.get('/trending');
                setPosts(response.data);
            } catch (err) {
                setError(getErrorMessage(err, 'Could not load trending posts'));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 2 }}>
                Trending (last 7 days)
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {posts.length === 0 && <Typography>No trending posts in the last 7 days.</Typography>}
            {posts.map((post) => (
                <Card key={post.id} sx={{ mb: 1.5 }}>
                    <CardContent>
                        <Typography fontWeight={700}>{post.title}</Typography>
                        <Typography variant="body2" color="text.secondary">By {post.username}</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>❤ {post.likes_count} · 💬 {post.comment_count}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}

export default TrendingPage;
