/* 
This plugin works in by obtaining all the Nodes.

References: 
https://vuejs.org/guide/reusability/plugins.html
https://snipcart.com/blog/vue-js-plugin
https://github.com/snipcart/vue-comments-overlay
*/

import { AOIDatabase } from "./AOIDatabase.js"

const defaultOptions = {
    drawCanvas: true,
    toTrackElements: [
        {tag: 'div', class: 'v-sidebar-menu vsm_collapsed', recursive: false, wordLevel: false},
        {tag: 'div', id: 'router-view', recursive: true, wordLevel: true}
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
        let canvas = document.createElement('canvas');

        // Set that the canvas covers the entire page so we can draw anywhere
        canvas.style.width = '100%';
        canvas.style.height = '100%';
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

        // Creating highlighting dictionary
        const aoiDatabase = new AOIDatabase();
        AOIPlugin.aoiDatabase = aoiDatabase;
        
        // Track when capturing data
        let isTracking = false;
        AOIPlugin.isTracking = isTracking;
    },

    configureCanvas: () => {
        
        // Clear the canvas
        let context = AOIPlugin.canvas.getContext('2d');
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
    
    drawBoundingBox: (rect) => {

        // Draw the bounding box on the html
        let context = AOIPlugin.canvas.getContext('2d');
        context.fillStyle = "rgba(255,0,0,0.25)";
        context.fillRect(rect.x, rect.y, rect.width, rect.height);
    },

    drawElementsInCanvas: () => {
        console.log("DRAWING");
    },

    captureAOI: () => {

        if (!AOIPlugin.isTracking) {
            AOIPlugin.isTracking = true;
            
            // Prevent calling methods too fast (before the document is 
            // rendered correctly and fully)
            setTimeout(() => {

                // Track the desired elements
                for (let i = 0; i < AOIPlugin.options.toTrackElements.length; i++) {
                    let toTrackElement = AOIPlugin.options.toTrackElements[i];
                    AOIPlugin.trackElement(toTrackElement);
                }
                
                // Reconfigure the canvas as needed
                if (AOIPlugin.options.drawCanvas) {
                    AOIPlugin.configureCanvas();
                    AOIPlugin.drawElementsInCanvas();
                }

            }, 100);
            
            AOIPlugin.isTracking = false;
        }

    },

    trackElement: (elementConfiguration) => {

        if ("class" in elementConfiguration) {

            let elements = document.getElementsByClassName(elementConfiguration.class);

            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];
                let rectInfo = AOIPlugin.getRectInfo(
                    element, 
                    elementConfiguration.recursive, 
                    elementConfiguration.wordLevel
                );
                console.log(rectInfo);
            }
        }
    },

    getRectInfo: (element, recursive, wordLevel) => {

        let responseRectData = {
            elementRect: element.getBoundingClientRect()
        };

        if (recursive) {

            let childrenRectData = [];
            
            for (let i = 0; i < element.childElementCount; i++) {
                let childrenRect = AOIPlugin.getRectInfo(element.children[i], recursive, wordLevel);
                childrenRectData.push(childrenRect);
            }

            responseRectData.childrenRectData = childrenRectData;
        }

        return responseRectData;
    },

    recursiveSearching: (node) => {

        // Create Range object to find individual words
        let range = new Range();

        // Only interested in P and H1 Nodes
        if (['P', 'A', 'H1'].includes(node.nodeName)){

            // Obtain all the children nodes
            let childNodes = node.childNodes;
           
            // Iterate through all children
            for (let i = 0; i < childNodes.length; i++){
                
                // Compute the length of the range
                let childNode = childNodes[i];
                AOIPlugin.recursiveSearching(childNode);
            
            }
        }

        else if (node.nodeName == '#text'){
            
            // Determine if no text children
            let nodeText = node.wholeText;
            
            // If empty, return immediately
            if (nodeText == ''){
                return [];
            }

            let words = nodeText.split(" ");

            // For all text within the node, construct a range
            let textStartPointer = 0;
            let textEndPointer = 0;
            for (let j = 0; j < words.length; j++){

                textEndPointer = textStartPointer + words[j].length;
                
                range.setStart(node, textStartPointer);
                range.setEnd(node, textEndPointer);

                let rect = range.getBoundingClientRect();

                AOIPlugin.drawBoundingBox(rect);
                textStartPointer = textEndPointer + 1;

            }
            
            return [];

        }
        else if (node.nodeName == 'IMG') {
            return [];
        }

        else {
            return [];
        }
    },

    getTextNodes: () => {

        /* Reference: https://developer.mozilla.org/en-US/docs/Web/API/Document/createTreeWalker */
        let treeWalker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_ELEMENT
        );

        // Get the first node and then walk the tree
        let currentNode = treeWalker.currentNode;

        // Continue until no more nodes
        while(currentNode) {

            // Filter data
            let filterNames = ['H1', 'H2', 'H3', 'H4', 'P', 'A', 'IMG', 'FIGURE'];
            if (!filterNames.includes(currentNode.nodeName)){
                currentNode = treeWalker.nextNode();
                continue;
            }

            // Recursively searching the document
            AOIPlugin.recursiveSearching(currentNode);

            // Updating to the next node
            currentNode = treeWalker.nextNode();
        }
    }
}
