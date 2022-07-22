// Following the follow structure
// References: 
// https://vuejs.org/guide/reusability/plugins.html
// https://snipcart.com/blog/vue-js-plugin
// https://github.com/snipcart/vue-comments-overlay


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function getRandomColor() {
    let r = getRandomInt(0,255);
    let g = getRandomInt(0,255);
    let b = getRandomInt(0,255);
    return "rgba("+r+","+g+","+b+",0.05)"
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
    },

    takeAOIScreenshot: () => {

        // This requires getting all the text nodes
        AOIPlugin.getTextNodes();
    },

    getTextNodes: () => {

        /* Reference: https://developer.mozilla.org/en-US/docs/Web/API/Document/createTreeWalker */
        let treeWalker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_ELEMENT
        );

        // let nodeList = [];
        let contextList = [];
        let currentNode = treeWalker.currentNode;

        while(currentNode) {

            // Printing for debugging
            console.log(currentNode);

            // Get the bounding box of the node
            // Reference: https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
            let rect = currentNode.getBoundingClientRect();
            console.log(rect);
            
            // Draw the bounding box on the html
            let context = AOIPlugin.canvas.getContext('2d');
            context.rect(rect.x, rect.y, rect.width, rect.height);
            // context.fillStyle = 'rgba(255,0,0,0.1)';
            context.fillStyle = getRandomColor();
            context.fill();
            contextList.push(context);

            // Updating to the next node
            currentNode = treeWalker.nextNode();
        }

    }
}
