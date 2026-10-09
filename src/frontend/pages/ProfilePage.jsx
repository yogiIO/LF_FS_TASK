import React, { useEffect, useState } from 'react';
import { Alert, Avatar, Box, Card, CardContent, CircularProgress, Stack, Typography } from '@mui/material';
import api, { getErrorMessage } from '../api/client';
import { useAuth } from '../context/SessionContext';

function ProfilePage() {
    const { currentUser } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const response = await api.get(`/users/${currentUser.id}`);
                setUser(response.data);
            } catch (err) {
                setError(getErrorMessage(err, 'Could not load profile'));
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [currentUser.id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) return <Alert severity="error">{error}</Alert>;
    if (!user) return <Typography>User not found</Typography>;

    return (
        <Card>
            <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar src={user.profile_picture_url} sx={{ width: 72, height: 72 }}>
                        {(user.username || '?')[0]}
                    </Avatar>
                    <Box>
                        <Typography variant="h5" fontWeight={800}>{user.username}</Typography>
                        <Typography color="text.secondary">{user.bio}</Typography>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={4} sx={{ mt: 3 }}>
                    <Typography><strong>{user.total_posts}</strong> Posts</Typography>
                    <Typography><strong>{user.total_comments}</strong> Comments</Typography>
                    <Typography><strong>{user.total_post_likes || 0}</strong> Likes</Typography>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default ProfilePage;
