<template>
    <div id="app">
  <highlightable
    @share="onShare"
    @highlight="onHighlight"                 @unhighlight="onUnHighlight"
  >
    <p id="p1">
      possimus nisi assumenda architecto exercitationem dol ore quo praesentium , deleniti <span id="w01" class="abc">reiciendis</span> <span id="w02" class="abc"> sed</span> <span id="w03" class="abc"> abcdef</span> nihil! 
    </p>     
 <p><span id="w0" class="hl">TREASURE</span> <span id="w1" class="hl">ISLAND</span></p><p><span id="w2" class="hl">PART</span> <span id="w3" class="hl">ONE--The</span> <span id="w4" class="hl">Old</span> <span id="w5" class="hl">Buccaneer</span></p><p><span id="w6" class="hl">The</span> <span id="w7" class="hl">Old</span> <span id="w8" class="hl">Sea-dog</span> <span id="w9" class="hl">at</span> <span id="w10" class="hl">the</span> <span id="w11" class="hl">Admiral</span> <span id="w12" class="hl">Benbow</span></p><p><span id="w13" class="hl">SQUIRE</span> <span id="w14" class="hl">TRELAWNEY,</span> <span id="w15" class="hl">Dr.</span> <span id="w16" class="hl">Livesey,</span> <span id="w17" class="hl">and</span> <span id="w18" class="hl">the</span> <span id="w19" class="hl">rest</span> <span id="w20" class="hl">of</span> <span id="w21" class="hl">these</span> <span id="w22" class="hl">gentlemen</span> <span id="w23" class="hl">having</span></p><p><span id="w24" class="hl">asked</span> <span id="w25" class="hl">me</span> <span id="w26" class="hl">to</span> <span id="w27" class="hl">write</span> <span id="w28" class="hl">down</span> <span id="w29" class="hl">the</span> <span id="w30" class="hl">whole</span> <span id="w31" class="hl">particulars</span> <span id="w32" class="hl">about</span> <span id="w33" class="hl">Treasure</span> <span id="w34" class="hl">Island,</span> <span id="w35" class="hl">from</span></p><p><span id="w36" class="hl">the</span> <span id="w37" class="hl">beginning</span> <span id="w38" class="hl">to</span> <span id="w39" class="hl">the</span> <span id="w40" class="hl">end,</span> <span id="w41" class="hl">keeping</span> <span id="w42" class="hl">nothing</span> <span id="w43" class="hl">back</span> <span id="w44" class="hl">but</span> <span id="w45" class="hl">the</span> <span id="w46" class="hl">bearings</span> <span id="w47" class="hl">of</span> <span id="w48" class="hl">the</span></p><p><span id="w49" class="hl">island,</span> <span id="w50" class="hl">and</span> <span id="w51" class="hl">that</span> <span id="w52" class="hl">only</span> <span id="w53" class="hl">because</span> <span id="w54" class="hl">there</span> <span id="w55" class="hl">is</span> <span id="w56" class="hl">still</span> <span id="w57" class="hl">treasure</span> <span id="w58" class="hl">not</span> <span id="w59" class="hl">yet</span> <span id="w60" class="hl">lifted,</span> <span id="w61" class="hl">I</span></p><p><span id="w62" class="hl">take</span> <span id="w63" class="hl">up</span> <span id="w64" class="hl">my</span> <span id="w65" class="hl">pen</span> <span id="w66" class="hl">in</span> <span id="w67" class="hl">the</span> <span id="w68" class="hl">year</span> <span id="w69" class="hl">of</span> <span id="w70" class="hl">grace</span> <span id="w71" class="hl">17__</span> <span id="w72" class="hl">and</span> <span id="w73" class="hl">go</span> <span id="w74" class="hl">back</span> <span id="w75" class="hl">to</span> <span id="w76" class="hl">the</span> <span id="w77" class="hl">time</span> <span id="w78" class="hl">when</span></p><p><span id="w79" class="hl">my</span> <span id="w80" class="hl">father</span> <span id="w81" class="hl">kept</span> <span id="w82" class="hl">the</span> <span id="w83" class="hl">Admiral</span> <span id="w84" class="hl">Benbow</span> <span id="w85" class="hl">inn</span> <span id="w86" class="hl">and</span> <span id="w87" class="hl">the</span> <span id="w88" class="hl">brown</span> <span id="w89" class="hl">old</span> <span id="w90" class="hl">seaman</span> <span id="w91" class="hl">with</span> <span id="w92" class="hl">the</span></p><p><span id="w93" class="hl">sabre</span> <span id="w94" class="hl">cut</span> <span id="w95" class="hl">first</span> <span id="w96" class="hl">took</span> <span id="w97" class="hl">up</span> <span id="w98" class="hl">his</span> <span id="w99" class="hl">lodging</span> <span id="w100" class="hl">under</span> <span id="w101" class="hl">our</span> <span id="w102" class="hl">roof.</span></p><p><span id="w103" class="hl">I</span> <span id="w104" class="hl">remember</span> <span id="w105" class="hl">him</span> <span id="w106" class="hl">as</span> <span id="w107" class="hl">if</span> <span id="w108" class="hl">it</span> <span id="w109" class="hl">were</span> <span id="w110" class="hl">yesterday,</span> <span id="w111" class="hl">as</span> <span id="w112" class="hl">he</span> <span id="w113" class="hl">came</span> <span id="w114" class="hl">plodding</span> <span id="w115" class="hl">to</span> <span id="w116" class="hl">the</span></p><p><span id="w117" class="hl">inn</span> <span id="w118" class="hl">door,</span> <span id="w119" class="hl">his</span> <span id="w120" class="hl">sea-chest</span> <span id="w121" class="hl">following</span> <span id="w122" class="hl">behind</span> <span id="w123" class="hl">him</span> <span id="w124" class="hl">in</span> <span id="w125" class="hl">a</span> <span id="w126" class="hl">hand-barrow--a</span></p><p><span id="w127" class="hl">tall,</span> <span id="w128" class="hl">strong,</span> <span id="w129" class="hl">heavy,</span> <span id="w130" class="hl">nut-brown</span> <span id="w131" class="hl">man,</span> <span id="w132" class="hl">his</span> <span id="w133" class="hl">tarry</span> <span id="w134" class="hl">pigtail</span> <span id="w135" class="hl">falling</span> <span id="w136" class="hl">over</span> <span id="w137" class="hl">the</span></p><p><span id="w138" class="hl">shoulder</span> <span id="w139" class="hl">of</span> <span id="w140" class="hl">his</span> <span id="w141" class="hl">soiled</span> <span id="w142" class="hl">blue</span> <span id="w143" class="hl">coat,</span> <span id="w144" class="hl">his</span> <span id="w145" class="hl">hands</span> <span id="w146" class="hl">ragged</span> <span id="w147" class="hl">and</span> <span id="w148" class="hl">scarred,</span> <span id="w149" class="hl">with</span></p><p><span id="w150" class="hl">black,</span> <span id="w151" class="hl">broken</span> <span id="w152" class="hl">nails,</span> <span id="w153" class="hl">and</span> <span id="w154" class="hl">the</span> <span id="w155" class="hl">sabre</span> <span id="w156" class="hl">cut</span> <span id="w157" class="hl">across</span> <span id="w158" class="hl">one</span> <span id="w159" class="hl">cheek,</span> <span id="w160" class="hl">a</span> <span id="w161" class="hl">dirty,</span> <span id="w162" class="hl">livid</span></p><p><span id="w163" class="hl">white.</span> <span id="w164" class="hl">I</span> <span id="w165" class="hl">remember</span> <span id="w166" class="hl">him</span> <span id="w167" class="hl">looking</span> <span id="w168" class="hl">round</span> <span id="w169" class="hl">the</span> <span id="w170" class="hl">cove</span> <span id="w171" class="hl">and</span> <span id="w172" class="hl">whistling</span> <span id="w173" class="hl">to</span> <span id="w174" class="hl">himself</span></p><p><span id="w175" class="hl">as</span> <span id="w176" class="hl">he</span> <span id="w177" class="hl">did</span> <span id="w178" class="hl">so,</span> <span id="w179" class="hl">and</span> <span id="w180" class="hl">then</span> <span id="w181" class="hl">breaking</span> <span id="w182" class="hl">out</span> <span id="w183" class="hl">in</span> <span id="w184" class="hl">that</span> <span id="w185" class="hl">old</span> <span id="w186" class="hl">sea-song</span> <span id="w187" class="hl">that</span> <span id="w188" class="hl">he</span> <span id="w189" class="hl">sang</span> <span id="w190" class="hl">so</span></p><p><span id="w191" class="hl">often</span> <span id="w192" class="hl">afterwards:</span></p><p><span id="w193" class="hl">"Fifteen</span> <span id="w194" class="hl">men</span> <span id="w195" class="hl">on</span> <span id="w196" class="hl">the</span> <span id="w197" class="hl">dead</span> <span id="w198" class="hl">man's</span> <span id="w199" class="hl">chest--</span></p><p><span id="w200" class="hl">Yo-ho-ho,</span> <span id="w201" class="hl">and</span> <span id="w202" class="hl">a</span> <span id="w203" class="hl">bottle</span> <span id="w204" class="hl">of</span> <span id="w205" class="hl">rum!"</span></p><p><span id="w206" class="hl">in</span> <span id="w207" class="hl">the</span> <span id="w208" class="hl">high,</span> <span id="w209" class="hl">old</span> <span id="w210" class="hl">tottering</span> <span id="w211" class="hl">voice</span> <span id="w212" class="hl">that</span> <span id="w213" class="hl">seemed</span> <span id="w214" class="hl">to</span> <span id="w215" class="hl">have</span> <span id="w216" class="hl">been</span> <span id="w217" class="hl">tuned</span> <span id="w218" class="hl">and</span></p><p><span id="w219" class="hl">broken</span> <span id="w220" class="hl">at</span> <span id="w221" class="hl">the</span> <span id="w222" class="hl">capstan</span> <span id="w223" class="hl">bars.</span> <span id="w224" class="hl">Then</span> <span id="w225" class="hl">he</span> <span id="w226" class="hl">rapped</span> <span id="w227" class="hl">on</span> <span id="w228" class="hl">the</span> <span id="w229" class="hl">door</span> <span id="w230" class="hl">with</span> <span id="w231" class="hl">a</span> <span id="w232" class="hl">bit</span> <span id="w233" class="hl">of</span></p><p><span id="w234" class="hl">stick</span> <span id="w235" class="hl">like</span> <span id="w236" class="hl">a</span> <span id="w237" class="hl">handspike</span> <span id="w238" class="hl">that</span> <span id="w239" class="hl">he</span> <span id="w240" class="hl">carried,</span> <span id="w241" class="hl">and</span> <span id="w242" class="hl">when</span> <span id="w243" class="hl">my</span> <span id="w244" class="hl">father</span> <span id="w245" class="hl">appeared,</span></p><p><span id="w246" class="hl">called</span> <span id="w247" class="hl">roughly</span> <span id="w248" class="hl">for</span> <span id="w249" class="hl">a</span> <span id="w250" class="hl">glass</span> <span id="w251" class="hl">of</span> 
    <span id="w252" class="hl">rum.</span> <span id="w253" class="hl">This,</span> <span id="w254" class="hl">when</span> <span id="w255" class="hl">it</span> <span id="w256" class="hl">was</span> <span id="w257" class="hl">brought</span> <span id="w258" class="hl">to</span> <span id="w259" class="hl">him,</span></p><p><span id="w260" class="hl">he</span> <span id="w261" class="hl">drank</span> <span id="w262" class="hl">slowly,</span> <span id="w263" class="hl">like</span> <span id="w264" class="hl">a</span> <span id="w265" class="hl">connoisseur,</span> <span id="w266" class="hl">lingering</span> <span id="w267" class="hl">on</span> <span id="w268" class="hl">the</span> <span id="w269" class="hl">taste</span> <span id="w270" class="hl">and</span> <span id="w271" class="hl">still</span></p><p><span id="w272" class="hl">looking</span> <span id="w273" class="hl">about</span> <span id="w274" class="hl">him</span> <span id="w275" class="hl">at</span> <span id="w276" class="hl">the</span> <span id="w277" class="hl">cliffs</span> <span id="w278" class="hl">and</span> <span id="w279" class="hl">up</span> <span id="w280" class="hl">at</span> <span id="w281" class="hl">our</span> <span id="w282" class="hl">signboard.</span></p>
  </highlightable>
  <highlightable     @share="onShare"
    @highlight="onHighlight"
                 @unhighlight="onUnHighlight"
                 >
    <p> <span id="w4" class="abc"> aw</span>
     par2 
    </p>
  </highlightable>
  <p>
    <strong>This paragraph can't be highlighted.</strong> quasi consequatur ducimus quo in, cum soluta eos dolores tempore unde voluptate modi.
  </p>
 
</div>
<span id="dictio"> Dictionary text goes here</span>
  <div>
    <div
      v-show="showTools"
      class="tools"
      :style="{
        left: `${x}px`,
        top: `${y}px`
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
  
    computed: {
      highlightableEl () {
        return this.$slots.default[0].elm
      }
    },
  
    mounted () {
      window.addEventListener('mouseup', this.onMouseup)
    },
  
    beforeDestroy () {
      window.removeEventListener('mouseup', this.onMouseup)
    },
  
    methods: {
      onShare (text) {
        console.log('share:', text);
        document.getElementById("dictio").innerHTML='hello world';
      },
  
      onHighlight (words_selected ) {
        console.log('highlight:', words_selected);
        
        for (let w of words_selected) {
          document.getElementById(w).style='background-color:#FF3100';
        }
        
      },
  
      onUnHighlight (words_selected ) {
        console.log('remove highlight:');
        console.log('unhighlight:', words_selected);
        
        for (let w of words_selected) {
          document.getElementById(w).style='background-color:#FFFFFF';
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
        console.log('width', width, x,y, nrange);
        
        this.x = x + (width / 2)
        this.y = y + window.scrollY - 10
        this.showTools = true
        this.selectedText = selection.toString()
        
  
        const isSame=selection.anchorNode.isSameNode(selection.focusNode);
        console.log('same node',  isSame );
        
        const arr_words=[];
        let wc=0;
        for(let i = 0; i < selection.rangeCount; i++) {
            
           
            let clo=selection.getRangeAt(i).cloneContents();
           let query_found = clo.querySelectorAll('span.hl');
           
          if ( query_found.length >0 ){
          
           for (let word of query_found) {
                   
             console.log('logger ',word);
             
             arr_words[wc]=word.id ;
             wc=wc+1;          
             
               }
          } else{
            let word= single_word_scenario(selection.getRangeAt(i));
            if (word.length >0){
               
              arr_words[wc]=word;
              wc=wc+1;  
               console.log('lone', word);
             }
            
          }
  
          
          
        }
        
        this.word_count=wc;
        this.words_sel=arr_words;
        console.log('array', arr_words);
      },
      
      handleAction (action) {
        this.$emit(action, this.words_sel)
      }
    }
  })
  
  function single_word_scenario(selec_range){
    const regex = /w(\d+)/;
    const com_anc=selec_range.commonAncestorContainer;
    let id_str=''
    if (com_anc.parentNode.nodeName!="SPAN"){
      return ''
    }
    id_str=com_anc.parentNode.id;
    let rgx =id_str.match(regex);
    if ( rgx.length <2 ){
      
      return ''
    }
      
   return id_str;
  }
  
  
  function get_pos(node, direction){ 
  
      var is_par=false;
      var start_pos=0;
      var end_pos=0;
      var id_str ='';
      const regex = /w(\d+)/;
      try{
        if (node.parentNode.nodeName=='P'){
          is_par=true;
          id_str= node.nextSibling.id;
          console.log('call from P case');
        } else if (node.parentNode.nodeName=='span'){
          is_par=false
          id_str= node.parentNode.id;    
          console.log('call from S case');
        }
        else {
          id_str='';
          console.log('call from null case');
        }
  
        var rgx =id_str.match(regex);
        start_pos= rgx[1] ;
      }catch(err){
        console.log('err',err);
        start_pos=-1;
  
      }
    return start_pos;
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