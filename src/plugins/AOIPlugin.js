/* 
This plugin works in by obtaining all the Nodes.

References: 
https://vuejs.org/guide/reusability/plugins.html
https://snipcart.com/blog/vue-js-plugin
https://github.com/snipcart/vue-comments-overlay
*/

// Reference: https://stackoverflow.com/a/2117523/13231446
// function uuidv4() {
//   return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
//     (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
//   );
// }

// function getRandomInt(min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(Math.random() * (max - min) + min);
// }

function getRandomColor() {
    // let r = getRandomInt(100,200);
    // let g = getRandomInt(100,200);
    // let b = getRandomInt(100,200);
    let r = 255;
    let g = 0;
    let b = 0;
    return "rgba("+r+","+g+","+b+",0.25)"
}

export const AOIPlugin = {
    
    // In this function, we provide
    install: () => {

        // Adding the event listener to trigger a screenshot
        document.addEventListener("click", AOIPlugin.takeAOIScreenshot);
    
        // Reference: https://stackoverflow.com/questions/19840907/draw-rectangle-over-html-with-javascript
        let canvas = document.createElement('canvas');

        // Set that the canvas covers the entire page so we can draw anywhere
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.position = 'absolute';
        canvas.style.left = 0;
        canvas.style.top = 0;
        canvas.style.zIndex=1000000;
        canvas.style.pointerEvents='none'

        // Storing the canvas in the Plugin
        AOIPlugin.canvas = canvas
        
        // Appending the canvas to the document
        document.body.appendChild(AOIPlugin.canvas);

        // Creating highlighting dictionary
        let highlightDict = {};
        AOIPlugin.highlightDict = highlightDict;
    },

    takeAOIScreenshot: () => {

        // This requires getting all the text nodes
        AOIPlugin.getTextNodes();
    },

    drawBoundingBox: (rect) => {

        // Draw the bounding box on the html
        let context = AOIPlugin.canvas.getContext('2d');
        context.fillStyle = getRandomColor();
        context.fillRect(rect.x, rect.y, rect.width, rect.height);
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
            console.log(nodeText);
            
            // If empty, return immediately
            if (nodeText == ''){
                return [];
            }

            let words = nodeText.split(" ");
            console.log(words);

            // For all text within the node, construct a range
            let textStartPointer = 0;
            let textEndPointer = 0;
            for (let j = 0; j < words.length; j++){

                textEndPointer = textStartPointer + words[j].length;
                
                console.log(j, words[j], words[j].length, textStartPointer, textEndPointer);

                range.setStart(node, textStartPointer);
                range.setEnd(node, textEndPointer);

                // console.log(range);
                let rect = range.getBoundingClientRect();
                // console.log(rect);

                AOIPlugin.drawBoundingBox(rect);
                textStartPointer = textEndPointer + 1;

            }
            
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

            // Printing for debugging
            console.log(currentNode, currentNode.nodeType);

            // Recursively searching the document
            AOIPlugin.recursiveSearching(currentNode);

            // Get the bounding box of the node
            // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
            // let rect = currentNode.getBoundingClientRect();
            // console.log(rect);
            
            // Updating to the next node
            currentNode = treeWalker.nextNode();
        }

    }
}
