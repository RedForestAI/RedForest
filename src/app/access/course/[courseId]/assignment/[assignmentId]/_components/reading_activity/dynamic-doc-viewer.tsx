'use client'

import dynamic from "next/dynamic";

const DynamicDocViewer = dynamic(
    (() => {
        if (typeof window !== 'undefined') {
            return import('./pdf-viewer');
        }
    }) as any,
    { ssr: false } // This will prevent the module from being loaded on the server-side
);

export default DynamicDocViewer;