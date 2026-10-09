import React, { useEffect, useState } from 'react';
import { Fab, Zoom } from '@mui/material';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';

function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > 320);
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <Zoom in={visible}>
            <Fab
                color="primary"
                size="small"
                aria-label="Scroll to top"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                sx={{
                    position: 'fixed',
                    right: 24,
                    bottom: 24,
                    zIndex: 20,
                    boxShadow: 2
                }}
            >
                <KeyboardArrowUpRoundedIcon />
            </Fab>
        </Zoom>
    );
}

export default ScrollToTop;
