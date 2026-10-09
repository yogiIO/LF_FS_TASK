import React, { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import api, { getErrorMessage } from '../api/client';

function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searched, setSearched] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        try {
            const response = await api.get('/search', { params: { q: query } });
            setResults(response.data);
            setSearched(true);
            setError('');
        } catch (err) {
            setError(getErrorMessage(err, 'Search failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>Search</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
                Find posts by title or content. Try a word from a post you remember.
            </Typography>
            <Stack component="form" onSubmit={handleSearch} direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search posts..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </Button>
            </Stack>
            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                    <CircularProgress size={28} />
                </Box>
            )}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {!searched && (
                <Card>
                    <CardContent>
                        <Typography fontWeight={700} gutterBottom>Looking for something?</Typography>
                        <Typography color="text.secondary">
                            Search matches titles and body text. Examples: a username from a title,
                            a topic, or a phrase from a post.
                        </Typography>
                    </CardContent>
                </Card>
            )}
            {searched && results.length === 0 && <Typography>No results found</Typography>}
            {results.map((post) => (
                <Card key={post.id} sx={{ mb: 1.5 }}>
                    <CardContent>
                        <Typography fontWeight={700}>{post.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {(post.content || '').length > 100
                                ? `${post.content.substring(0, 100)}...`
                                : (post.content || '')}
                        </Typography>
                        <Typography variant="caption">By {post.username}</Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}

export default SearchPage;
