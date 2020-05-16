import React from "react";

const Timeline = () => {
    new Promise((resolve, reject) => {
        const script = document.createElement('script');
        document.body.appendChild(script);
        script.onload = resolve;
        script.onerror = reject;
        script.async = false;
        script.src = 'https://platform.twitter.com/widgets.js';
    });

    return (
        <div>
            <style>
                .timeline-Widget ""
            </style>
            <a className="twitter-timeline" 
                data-lang="en" 
                data-dnt="true" 
                data-theme="dark"
                href="https://twitter.com/TheHugeEight?ref_src=twsrc%5Etfw">
            </a>
        </div>
    );
};
export default Timeline;

