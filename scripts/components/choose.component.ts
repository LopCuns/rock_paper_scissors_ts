import randomBetween from "../utilities/randomBetween.js"
const gameOptions = ['rock','paper','scissors'] as const

const gameOptionsLinks = {
  rock : '../assets/rock.png',
  paper : '../assets/paper.png',
  scissors : '../assets/scissors.png'
}



const template : HTMLTemplateElement = document.createElement('template')
template.innerHTML =  `
<div class="component_wrapper">
  <img class="component_image">
</div>
`
// DEFINE UTILITY TYPES
type gameOption = typeof gameOptions[number]
type classQuery = `.${string}`
type idQuery = `#${string}`
type attrQuery = `[${string}=${string}]`
type queryString = classQuery | idQuery | attrQuery

class RPSChoose extends HTMLElement {
    chosen : gameOption;
    image_source : string;
    contentHTML : Node;
    stylesheet : string;
    constructor() {
      super()
      // give a default value in case a wrong value is given
      this.chosen = gameOptions[randomBetween(0,2)]
      this.image_source = gameOptionsLinks[this.chosen]
      this.contentHTML = template.content.cloneNode(true)
      this.stylesheet = ``
      this.attachShadow({ mode : 'open' })
    }
    static get observedAttributes(){
      return ['data-option','data-bgcolor','data-bordercolor']
    }
    getFromContent<HTMLType extends HTMLElement>(query : queryString) : HTMLType {
      const element = this.shadowRoot!.querySelector(query)
      if (!element) throw new Error(`Query ${query} does not match any element`)
      return this.shadowRoot!.querySelector(query) as HTMLType
    }
    connectedCallback(){
      // change the option selected if is valid an assign the image
      const data_option = this.getAttribute('data-option')
      if (!data_option || !gameOptions.some(option => option === data_option)) return 
      this.chosen = data_option as gameOption
      this.image_source = gameOptionsLinks[this.chosen]

      // Set the styles
      const bgColor : string | null = this.getAttribute('data-bgColor')
      const borderColor : string | null = this.getAttribute('data-borderColor')
      this.stylesheet = `
      :host {
        --bgColor :  ${bgColor || '#faa'};
        --borderColor : ${borderColor || '#aaf'};
      }
      .hidden {
        visibility : hidden;
      }
      .component_wrapper {
        background-color : var(--bgColor);
        padding: 2rem;
        border : 15px solid var(--borderColor);
        border-radius : 50%;
        transition: transform 0.3s, filter 0.3s;
        cursor: pointer;
      }
      .component_wrapper:hover{
        transform: scale(.95);
        filter : brightness(85%);
      }
      .component_wrapper:hover > .component_image {
        animation : move .5s;
      }
      .component_image {
        width : 100%;
        height : 100%;
        object-fit: contain;
        aspect-ratio : 1;
      }
      @keyframes move {
        0% {
          transform: rotate(0deg);
        }
        25% {
          transform: rotate(25deg);
        }
        50% {
          transform: rotate(-25deg)
        }
        75% {
          transform: rotate(25deg);
        }
        100% {
          transform: rotate(0deg);
        }
      }
      `
      // Set the inner HTML structure of the component
      this.shadowRoot?.appendChild(this.contentHTML)

      // change image source
      const choseImg : HTMLImageElement = this.getFromContent<HTMLImageElement>('.component_image')
      choseImg.src = this.image_source
      // Apply the styles
      const style : HTMLStyleElement = document.createElement('style')
      style.textContent = this.stylesheet
      this.shadowRoot?.appendChild(style)
    }
    updateOption(newValue : string) : void{
      if(!gameOptions.some(option => option === newValue)) return
        this.getFromContent<HTMLImageElement>('.component_image').src = gameOptionsLinks[newValue as gameOption]
    }
    updateBgColor(newValue : string) : void{
      this.style.setProperty('--bgColor',newValue)
    }
    updateBorderColor(newValue : string) : void {
      this.style.setProperty('--borderColor',newValue)
    }
    attributeChangedCallback(attr : string,oldValue : string,newValue : string) {
      const attrActions : {[index : string] : () => void} = {
        'data-option': () => this.updateOption(newValue),
        'data-bgcolor': () => this.updateBgColor(newValue),
        'data-bordercolor': () => this.updateBorderColor(newValue)
      }
      if(!attrActions[attr]) return
      attrActions[attr]()
    }
}

customElements.define('rps-choose',RPSChoose)