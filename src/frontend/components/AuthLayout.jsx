import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

function AuthLayout({ title, children }) {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' }
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    bgcolor: 'primary.main',
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    px: { xs: 4, md: 8 },
                    py: 6
                }}
            >
                <Typography variant="h3" fontWeight={800} sx={{ mb: 2 }}>
                    SocialApp
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 360 }}>
                    Share moments. Follow the conversation. Stay close.
                </Typography>
            </Box>
            <Box
                sx={{
                    flex: 1,
                    bgcolor: 'background.default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3
                }}
            >
                <Card sx={{ width: '100%', maxWidth: 420 }}>
                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" fontWeight={800} gutterBottom>
                            {title}
                        </Typography>
                        {children}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default AuthLayout;
