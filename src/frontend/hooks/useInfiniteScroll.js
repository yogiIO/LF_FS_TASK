import { useEffect, useRef } from 'react';

function useInfiniteScroll({ enabled, hasMore, onLoadMore, rootMargin = '240px' }) {
    const sentinelRef = useRef(null);

    useEffect(() => {
        if (!enabled || !hasMore) return undefined;

        const node = sentinelRef.current;
        if (!node) return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    onLoadMore();
                }
            },
            { rootMargin }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [enabled, hasMore, onLoadMore, rootMargin]);

    return sentinelRef;
}

export default useInfiniteScroll;
