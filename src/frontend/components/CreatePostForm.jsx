import React, { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import api, { getErrorMessage } from '../api/client';
import { CONTENT_MAX, TITLE_MAX } from '../constants/limits';

const fieldSx = {
    mb: 1.5,
    '& .MuiOutlinedInput-root': {
        bgcolor: '#f8fafc',
        borderRadius: '12px',
        '& fieldset': { borderColor: '#e5e7eb' }
    }
};

function CreatePostForm({ onCreated }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedTitle = title.trim();
        const trimmedContent = content.trim();

        if (!trimmedTitle) {
            setError('Title is required');
            return;
        }
        if (trimmedTitle.length > TITLE_MAX) {
            setError(`Title must be at most ${TITLE_MAX} characters`);
            return;
        }
        if (!trimmedContent) {
            setError('Description is required');
            return;
        }
        if (trimmedContent.length > CONTENT_MAX) {
            setError(`Description must be at most ${CONTENT_MAX} characters`);
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.post('/posts', { title: trimmedTitle, content: trimmedContent });
            setTitle('');
            setContent('');
            onCreated?.();
        } catch (err) {
            setError(getErrorMessage(err, 'Could not create post'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ mb: 2, borderRadius: '16px' }}>
            <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                    Create Post
                </Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Give your post a title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
                        required
                        inputProps={{ maxLength: TITLE_MAX }}
                        sx={fieldSx}
                    />
                    <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        maxRows={6}
                        placeholder="What's on your mind?"
                        value={content}
                        onChange={(e) => setContent(e.target.value.slice(0, CONTENT_MAX))}
                        required
                        inputProps={{ maxLength: CONTENT_MAX }}
                        sx={{
                            ...fieldSx,
                            '& textarea': {
                                maxHeight: 160,
                                overflow: 'auto !important'
                            }
                        }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button type="submit" variant="contained" startIcon={<AddRoundedIcon />} disabled={loading}>
                            {loading ? 'Posting...' : 'Post'}
                        </Button>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}

export default CreatePostForm;
