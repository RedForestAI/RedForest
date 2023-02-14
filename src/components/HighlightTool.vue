<template>
  <div class="scr-highlighter-tool">
    <div
      v-show="showTools"
      class="tools"
      :style="{
        left: `${x}px`,
        top: `${y}px`,
      }"
      @mousedown.prevent=""
    >
      <span
        class="item"
        @mousedown.prevent="handleAction('share')"
      >
        <svg style="width:24px;height:24px" 
          viewBox="0 0 256.000000 256.000000"
          preserveAspectRatio="xMidYMid meet">   
          <g transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)"
            fill="#FFFFFF" stroke="none">
            <path d="M548 2386 c-97 -35 -150 -81 -199 -176 l-24 -45 0 -885 0 -885 27
            -51 c40 -76 70 -107 140 -145 l63 -34 792 0 c784 0 792 0 819 21 15 11 37 33
            48 48 21 27 21 35 21 806 0 771 0 779 -21 806 -11 15 -33 37 -48 48 -27 21
            -39 21 -806 26 -767 5 -779 5 -806 26 -53 39 -69 71 -69 134 0 63 16 95 69
            134 27 21 38 21 752 24 l725 2 24 -24 c23 -23 25 -32 25 -119 l0 -94 43 -7
            c23 -4 59 -18 80 -32 l38 -25 -3 180 c-3 196 -6 206 -72 255 -27 21 -37 21
            -804 23 -621 2 -784 0 -814 -11z m1585 -38 c58 -31 67 -58 67 -202 0 -136 -1
            -139 -53 -115 -22 10 -25 18 -29 88 -5 87 -22 121 -73 145 -29 14 -114 16
            -727 16 -453 0 -706 -4 -731 -11 -44 -12 -102 -59 -124 -103 -21 -40 -21 -132
            0 -172 22 -44 80 -91 124 -103 25 -7 295 -11 786 -11 l747 0 38 -34 37 -34 3
            -766 2 -766 -34 -37 -34 -38 -784 0 -783 0 -45 23 c-58 30 -95 66 -128 122
            l-27 45 0 885 c0 844 1 887 19 920 35 67 92 116 171 147 43 16 1547 18 1578 1z"/>
            <path d="M791 1622 c-57 -30 -126 -180 -166 -358 -17 -74 -32 -394 -21 -438
            12 -50 40 -66 110 -66 35 0 72 3 81 6 25 10 45 58 45 109 l0 45 120 0 120 0 0
            -45 c0 -51 20 -99 45 -109 9 -3 46 -6 81 -6 70 0 98 16 110 66 11 45 -4 354
            -21 433 -23 102 -68 232 -103 293 -44 78 -69 88 -232 88 -112 0 -141 -3 -169
            -18z m336 -37 c27 -19 88 -163 120 -285 22 -82 26 -122 31 -297 l4 -203 -81 0
            -81 0 0 80 0 80 -160 0 -160 0 0 -80 0 -80 -81 0 -81 0 4 203 c5 175 9 215 31
            297 32 122 93 266 120 285 31 22 303 22 334 0z"/>
            <path d="M879 1413 c-29 -73 -48 -136 -58 -189 -7 -33 -14 -69 -17 -81 l-4
            -23 160 0 160 0 -4 23 c-26 122 -41 181 -60 232 l-23 60 -72 3 c-70 3 -71 2
            -82 -25z m129 -26 c17 -20 65 -195 58 -213 -5 -12 -24 -14 -108 -12 l-103 3 2
            40 c3 42 39 162 56 183 13 16 82 16 95 -1z"/>
            <path d="M1430 1302 c-18 -14 -24 -32 -28 -75 -5 -68 2 -101 28 -127 18 -18
            34 -20 180 -20 117 0 160 -3 160 -12 0 -6 -81 -93 -179 -193 -199 -201 -197
            -196 -189 -326 6 -114 -10 -109 358 -109 373 0 355 -6 355 119 0 117 4 115
            -208 121 l-172 5 187 190 c208 213 206 209 196 347 -7 101 5 98 -358 98 -284
            0 -310 -1 -330 -18z m650 -119 l0 -98 -223 -222 -222 -223 222 0 223 0 0 -80
            0 -80 -320 0 -320 0 0 97 0 98 223 222 222 223 -222 0 -223 0 0 80 0 80 320 0
            320 0 0 -97z" />
          </g>
        </svg>
      </span>

      <span
        class="item"
        @mousedown.prevent="handleAction('highlight')"
      >
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path fill="#0000FF" d="M18.5,1.15C17.97,1.15 17.46,1.34 17.07,1.73L11.26,7.55L16.91,13.2L22.73,7.39C23.5,6.61 23.5,5.35 22.73,4.56L19.89,1.73C19.5,1.34 19,1.15 18.5,1.15M10.3,8.5L4.34,14.46C3.56,15.24 3.56,16.5 4.36,17.31C3.14,18.54 1.9,19.77 0.67,21H6.33L7.19,20.14C7.97,20.9 9.22,20.89 10,20.12L15.95,14.16" />
        </svg>
      </span>
      
      <span class="item" @mousedown.prevent="handleAction('unhighlight')">
         <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path fill="#0000FF" d="M18.5,1.15C17.97,1.15 17.46,1.34 17.07,1.73L11.26,7.55L16.91,13.2L22.73,7.39C23.5,6.61 23.5,5.35 22.73,4.56L19.89,1.73C19.5,1.34 19,1.15 18.5,1.15M10.3,8.5L4.34,14.46C3.56,15.24 3.56,16.5 4.36,17.31C3.14,18.54 1.9,19.77 0.67,21H6.33L7.19,20.14C7.97,20.9 9.22,20.89 10,20.12L15.95,14.16" />
          <path fill="#FFFFFF" stroke="#FFFFFF" stroke-width="2" d="M3 0 L 18 24" />
          
        </svg>       
      </span>

    </div>
    <slot/>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'HiglightTool',
    data () {
      return {
        x: 0,
        y: 0,
        showTools: false,
        selectedText: ''
      }
    },
  
    mounted () {
      window.addEventListener('mouseup', this.onMouseup)
    },
  
    beforeUnmount() {
      window.removeEventListener('mouseup', this.onMouseup)
    },
  
    methods: {
      onShare (text) {
        console.log('share:', text)
        document.getElementById("dictio").innerHTML='hello world'
      },
  
      onHighlight (words_selected) {
        console.log('highlight:', words_selected)
        
        for (let w of words_selected) {
          document.getElementById(w).style['background-color'] = 'rgba(255,49,0,0.2)'
        }
        
      },
  
      onUnHighlight (words_selected) {
        console.log('remove highlight:')
        console.log('unhighlight:', words_selected)
        
        for (let w of words_selected) {
          document.getElementById(w).style['background-color'] = 'rgba(255,255,255,0)'
        }
        
      },
      onMouseup () {
        const selection = window.getSelection()
        const nrange=selection.rangeCount
        
        if (nrange==0){
          return 
        }
        
        
        const { x, y, width } = selection.getRangeAt(0).getBoundingClientRect()
        if (width <1) {
          this.showTools = false
          return
        }
        console.log('width', width, x,y, nrange)
        
        this.x = x + (width / 2)
        this.y = y + window.scrollY - 10
        this.showTools = true
        this.selectedText = selection.toString()
        
  
        const isSame=selection.anchorNode.isSameNode(selection.focusNode)
        console.log('same node',  isSame )
        
        const arr_words=[]
        let wc=0

        for(let i = 0; i < selection.rangeCount; i++) {
            
           
          let clo=selection.getRangeAt(i).cloneContents()
          let query_found = clo.querySelectorAll('p.hl')
             
          if ( query_found.length >0 ){
            
            for (let word of query_found) {
                   
              console.log('logger ',word)
           
              arr_words[wc]=word.id 
              wc=wc+1          
               
            }
          } else {
            let word= single_word_scenario(selection.getRangeAt(i))
            if (word.length >0) {
                   
              arr_words[wc]=word
              wc=wc+1  
              console.log('lone', word)
            }
          }
        }
        
        this.word_count=wc
        this.words_sel=arr_words
        console.log('array', arr_words)
      },
      
      handleAction (action) {

        // Changed this make it easier to know what is being called
        if (action == 'highlight') {
          this.onHighlight(this.words_sel)
        } else if (action == 'unhighlight') {
          this.onUnHighlight(this.words_sel)
        } else {
          console.log('Error: ' + action + ' event without handler.')
        }
      }
    }
  })
  
  function single_word_scenario(selec_range){
    const regex = /w(\d+)/
    const com_anc=selec_range.commonAncestorContainer
    let id_str=''

    if (com_anc.parentNode.nodeName!="P"){
      return ''
    }
    id_str=com_anc.parentNode.id
    let rgx =id_str.match(regex)
    if ( rgx == null || rgx.length <2 ){
      return ''
    }
      
    return id_str
  }
  
</script>

<style>

.tools {
  height: 30px;
  padding: 5px 10px;
  background: #3333;
  border-radius: 3px;
  position: absolute;
  top: 0;
  left: 0;
  transform: translate(-50%, -100%);
  transition: 0.2s all;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  background-color: #111111;
}

.tools:after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -5px;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid #333;
}

.item {
  color: #FFF;
  cursor: pointer;
}

.item path {
  fill: #FFF;
}

.item:hover path {
  fill: #1199ff;
}

.item:hover {
  color: #1199ff;
}

.item + .item {
  margin-left: 10px;
}

</style>
