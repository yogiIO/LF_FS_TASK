import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('UI crashed:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '1rem' }}>
                    Something went wrong. Refresh the page.
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
