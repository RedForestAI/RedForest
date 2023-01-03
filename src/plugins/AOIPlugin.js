/* 
This plugin works in by obtaining all the Nodes.

References: 
https://vuejs.org/guide/reusability/plugins.html
https://snipcart.com/blog/vue-js-plugin
https://github.com/snipcart/vue-comments-overlay
*/

// import { AOIDatabase } from "./AOIDatabase.js"

const defaultOptions = {
    drawCanvas: false,
    tagColorMap: {
        DEFAULT: "rgba(255,0,0,1)",
        DIV: "rgba(0,255,0,1)",
        IMG: "rgba(0,0,255,1)",
        TEXT: "rgba(0,0,255,1)"
    },
    toTrackElements: [
        // {tag: 'div', class: 'v-sidebar-menu vsm_collapsed', recursive: false, wordLevel: false},
        // {tag: 'div', id: 'scr-main-div', recursive: true, wordLevel: true},
        {tag: 'span', recursive: true, wordLevel: true}
    ]
}

export const AOIPlugin = {
    
    // Install required for Vue Plugin
    install: (Vue, options) => {

        // Saving input parameters
        AOIPlugin.Vue = Vue;
        AOIPlugin.options = {...defaultOptions, ...options};

        // Adding the event listener to trigger a screenshot
        window.addEventListener("load", AOIPlugin.captureAOI);
        window.addEventListener("resize", AOIPlugin.captureAOI);
        document.addEventListener("scroll", AOIPlugin.captureAOI);
        document.addEventListener("click", AOIPlugin.captureAOI);
    
        // Reference: https://stackoverflow.com/questions/19840907/draw-rectangle-over-html-with-javascript
        const canvas = document.createElement('canvas');

        // Set that the canvas covers the entire page so we can draw anywhere
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'fixed';
        canvas.style.left = 0;
        canvas.style.top = 0;
        canvas.margin = 0;
        canvas.padding = 0;
        canvas.style.zIndex=1000000;
        canvas.style.pointerEvents='none'

        // Storing the canvas in the Plugin
        AOIPlugin.canvas = canvas
        
        // Appending the canvas to the document
        document.body.appendChild(AOIPlugin.canvas);

        // List of tags to look and check for words
        const tagWordCheck = ['P', 'A', 'H1', 'H2', 'H3', 'H4', 'H5', 'SPAN'];
        AOIPlugin.tagWordCheck = tagWordCheck;

        // Creating highlighting dictionary
        // const aoiDatabase = new AOIDatabase();
        const aoiDatabase = [];
        AOIPlugin.aoiDatabase = aoiDatabase;
        
        // Track when capturing data
        const isTracking = false;
        AOIPlugin.isTracking = isTracking;
    },

    configureCanvas: () => {
        
        // Clear the canvas
        const context = AOIPlugin.canvas.getContext('2d');
        context.clearRect(0, 0, AOIPlugin.canvas.width, AOIPlugin.canvas.height);
        
        // If vertical scrollbar is visible, shift the canvas' width and height
        // Reference: https://stackoverflow.com/a/11226327/13231446
        if (document.body.offsetHeight > window.innerHeight) {
            AOIPlugin.canvas.width = window.innerWidth - 13;
        }
        else {
            AOIPlugin.canvas.width = window.innerWidth;
        }

        if (document.body.scrollWidth > document.body.clientWidth) {
            AOIPlugin.canvas.height = window.innerHeight - 15;
        }
        else {
            AOIPlugin.canvas.height = window.innerHeight;
        }

    },
    
    drawBoundingBox: (rect, color) => {

        // Draw the bounding box on the html
        const context = AOIPlugin.canvas.getContext('2d');
        context.fillStyle = color;
        context.fillRect(rect.x, rect.y, rect.width, rect.height);
    },

    drawCanvas: (elementsRectData) => {

        for (let i = 0; i < elementsRectData.length; i++){
            // Extract the current level element data
            const elementRect = elementsRectData[i];

            // Obtain the color from the tags
            let color = AOIPlugin.options.tagColorMap.DEFAULT;
            if (elementRect.tagName in AOIPlugin.options.tagColorMap) {
                color = AOIPlugin.options.tagColorMap[elementRect.tagName];
            }

            // Draw the bounding box
            AOIPlugin.drawBoundingBox(elementRect.elementRect, color);

            // Draw children if available
            if ("childrenRectData" in elementRect){
                AOIPlugin.drawCanvas(elementRect.childrenRectData);
            }

            // Draw words if available
            if ("wordsRectData" in elementRect){
                color = AOIPlugin.options.tagColorMap["TEXT"];
                for (let j = 0; j < elementRect.wordsRectData.length; j++){
                    AOIPlugin.drawBoundingBox(elementRect.wordsRectData[j].rectData, color);
                }
            }
        }
    },


    captureAOI: () => {

        if (!AOIPlugin.isTracking) {
            AOIPlugin.isTracking = true;
            
            // Prevent calling methods too fast (before the document is 
            // rendered correctly and fully)
            setTimeout(() => {
                
                // Track the desired elements
                for (let i = 0; i < AOIPlugin.options.toTrackElements.length; i++) {
                    const toTrackElement = AOIPlugin.options.toTrackElements[i];
                    AOIPlugin.aoiDatabase[i] = AOIPlugin.trackElement(toTrackElement);
                }
                
                // Reconfigure the canvas as needed
                if (AOIPlugin.options.drawCanvas) {
                    AOIPlugin.configureCanvas();
                    for (let i = 0; i < AOIPlugin.options.toTrackElements.length; i++) {
                        AOIPlugin.drawCanvas(AOIPlugin.aoiDatabase[i]);
                    }
                }
                
            }, 100);
            
            AOIPlugin.isTracking = false;
        }
    },


    trackElement: (elementConfiguration) => {
        
        const elementsRects = [];

        if ("class" in elementConfiguration) {

            const elements = document.getElementsByClassName(elementConfiguration.class);

            for (let i = 0; i < elements.length; i++) {
                
                const element = elements[i];
                const rectInfo = AOIPlugin.getRectInfo(
                    element, 
                    elementConfiguration.recursive, 
                    elementConfiguration.wordLevel
                );
                elementsRects.push(rectInfo);

            }
        }
        else if ("id" in elementConfiguration ) { // by "id"
            const element = document.getElementById(elementConfiguration.id);
            const rectInfo = AOIPlugin.getRectInfo(
                element,
                elementConfiguration.recursive,
                elementConfiguration.wordLevel
            );
            elementsRects.push(rectInfo);

        } 
        else { // by just the tag
            const elements = document.getElementsByTagName(elementConfiguration.tag);

            for (let i = 0; i < elements.length; i++) {
                
                const element = elements[i];
                const rectInfo = AOIPlugin.getRectInfo(
                    element, 
                    elementConfiguration.recursive, 
                    elementConfiguration.wordLevel
                );
                elementsRects.push(rectInfo);

            }

        }

        return elementsRects;
    },


    isInViewPort: (rect) => {
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },


    getRectInfo: (element, recursive, wordLevel) => {

        const responseRectData = {
            tagName: element.tagName,
            elementRect: element.getBoundingClientRect()
        };

        if (recursive && AOIPlugin.isInViewPort(responseRectData.elementRect)) {

            const childrenRectData = [];
            
            for (let i = 0; i < element.childElementCount; i++) {
                const childrenRect = AOIPlugin.getRectInfo(element.children[i], recursive, wordLevel);
                childrenRectData.push(childrenRect);
            }

            if (AOIPlugin.tagWordCheck.includes(element.tagName)){

                // Look for word data
                let wordsRectData = [];
                for (let j = 0; j < element.childNodes.length; j++) {
                    const node = element.childNodes[j];
                    wordsRectData = wordsRectData.concat(AOIPlugin.wordSearching(node));
                }

                // If we found data, store it
                if (wordsRectData.length != 0) {
                    responseRectData.wordsRectData = wordsRectData;
                }
            }

            responseRectData.childrenRectData = childrenRectData;
        }

        return responseRectData;
    },


    wordSearching: (node) => {

        // Create Range object to find individual words
        const range = new Range();
        const wordsRectData = [];
        let nodeText = '';

        // Extract the text
        if (node.nodeName == "#text"){
            nodeText = node.wholeText;
        }
            
        // If empty, return immediately
        if (nodeText == ''){
            return [];
        }

        if (node.nodeName == '#text'){     
         
            const words = nodeText.split(" ");

            // For all text within the node, construct a range
            let textStartPointer = 0;
            let textEndPointer = 0;
            for (let j = 0; j < words.length; j++){

                // Storage container for per-word data
                const wordRectData = {};

                // Select the word's range
                textEndPointer = textStartPointer + words[j].length;
                range.setStart(node, textStartPointer);
                range.setEnd(node, textEndPointer);

                // Get word data and store
                const rect = range.getBoundingClientRect();
                wordRectData.rectData = rect;
                wordRectData.text = words[j];
                wordsRectData.push(wordRectData);

                textStartPointer = textEndPointer + 1;

            }
        }

        return wordsRectData;
    },
}
