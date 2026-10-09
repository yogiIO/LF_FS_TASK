import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Avatar, Box, Button, Container, Stack, Toolbar, Typography } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import { useAuth } from '../context/SessionContext';
import ScrollToTop from './ScrollToTop';

const navItems = [
    { to: '/', label: 'Feed', icon: <HomeRoundedIcon fontSize="small" /> },
    { to: '/trending', label: 'Trending', icon: <LocalFireDepartmentRoundedIcon fontSize="small" /> },
    { to: '/search', label: 'Search', icon: <SearchRoundedIcon fontSize="small" /> },
    { to: '/profile', label: 'Profile', icon: <PersonRoundedIcon fontSize="small" /> }
];

function AppLayout() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e5e7eb' }}>
                <Toolbar
                    sx={{
                        maxWidth: 720,
                        mx: 'auto',
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr auto',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Typography variant="h6" color="primary" sx={{ justifySelf: 'start' }}>
                        SocialApp
                    </Typography>
                    <Stack direction="row" spacing={0.5} sx={{ justifySelf: 'center' }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.to}
                                component={NavLink}
                                to={item.to}
                                end={item.to === '/'}
                                startIcon={item.icon}
                                sx={{
                                    color: 'text.secondary',
                                    borderRadius: '999px',
                                    px: 1.5,
                                    '&.active': {
                                        bgcolor: '#f3e8ff',
                                        color: 'primary.main'
                                    }
                                }}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </Stack>
                    {currentUser ? (
                        <Box
                            sx={{
                                justifySelf: 'end',
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                flexWrap: 'nowrap',
                                gap: 1,
                                height: 40
                            }}
                        >
                            <Avatar
                                src={currentUser.profile_picture_url}
                                alt={currentUser.username}
                                sx={{ width: 32, height: 32 }}
                            >
                                {(currentUser.username || '?')[0]}
                            </Avatar>
                            <Button size="small" onClick={logout} sx={{ height: 32, whiteSpace: 'nowrap' }}>
                                Log out
                            </Button>
                        </Box>
                    ) : (
                        <Stack direction="row" spacing={1} sx={{ justifySelf: 'end', flexWrap: 'nowrap' }}>
                            <Button size="small" onClick={() => navigate('/login')} sx={{ whiteSpace: 'nowrap' }}>
                                Log in
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                onClick={() => navigate('/register')}
                                sx={{ whiteSpace: 'nowrap', minWidth: 'max-content' }}
                            >
                                Sign up
                            </Button>
                        </Stack>
                    )}
                </Toolbar>
            </AppBar>
            <Container maxWidth="sm" sx={{ py: 3 }}>
                <Outlet />
            </Container>
            <ScrollToTop />
        </Box>
    );
}

export default AppLayout;
