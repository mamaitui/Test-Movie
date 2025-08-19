import React, { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';

export default function Player({ option, getInstance, ...rest }) {
    const artRef = useRef();
    const artInstance = useRef(null); // To store the Artplayer instance

    useEffect(() => {
        // Create Artplayer instance only once on mount
        if (!artInstance.current) {
            artInstance.current = new Artplayer({
                ...option, // Pass all options initially
                container: artRef.current,
            });

            if (getInstance && typeof getInstance === 'function') {
                getInstance(artInstance.current);
            }
        }

        return () => {
            if (artInstance.current && artInstance.current.destroy) {
                artInstance.current.destroy(false);
                artInstance.current = null; // Clear the instance on unmount
            }
        };
    }, []); // Empty dependency array means this runs once on mount

    useEffect(() => {
        // Update URL and title when option.url or option.title changes
        if (artInstance.current) {
            if (option.url && artInstance.current.url !== option.url) {
                artInstance.current.switchUrl(option.url);
            }
            if (option.title && artInstance.current.title !== option.title) {
                artInstance.current.title = option.title;
            }
        }
    }, [option.url, option.title]); // Watch for URL and title changes

    return <div ref={artRef} {...rest}></div>;
}