import randomBetween from "../utilities/randomBetween.js";
const gameOptions = ['rock', 'paper', 'scissors'];
const gameOptionsLinks = {
    rock: '../assets/rock.png',
    paper: '../assets/paper.png',
    scissors: '../assets/scissors.png'
};
const template = document.createElement('template');
template.innerHTML = `
<div class="component_wrapper">
  <img class="component_image">
</div>
`;
class RPSChoose extends HTMLElement {
    constructor() {
        super();
        // give a default value in case a wrong value is given
        this.chosen = gameOptions[randomBetween(0, 2)];
        this.image_source = gameOptionsLinks[this.chosen];
        this.contentHTML = template.content.cloneNode(true);
        this.stylesheet = ``;
        this.attachShadow({ mode: 'open' });
    }
    static get observedAttributes() {
        return ['data-option', 'data-bgcolor', 'data-bordercolor'];
    }
    getFromContent(query) {
        const element = this.shadowRoot.querySelector(query);
        if (!element)
            throw new Error(`Query ${query} does not match any element`);
        return this.shadowRoot.querySelector(query);
    }
    connectedCallback() {
        var _a, _b;
        // change the option selected if is valid an assign the image
        const data_option = this.getAttribute('data-option');
        if (!data_option || !gameOptions.some(option => option === data_option))
            return;
        this.chosen = data_option;
        this.image_source = gameOptionsLinks[this.chosen];
        // Set the styles
        const bgColor = this.getAttribute('data-bgColor');
        const borderColor = this.getAttribute('data-borderColor');
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
      `;
        // Set the inner HTML structure of the component
        (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.appendChild(this.contentHTML);
        // change image source
        const choseImg = this.getFromContent('.component_image');
        choseImg.src = this.image_source;
        // Apply the styles
        const style = document.createElement('style');
        style.textContent = this.stylesheet;
        (_b = this.shadowRoot) === null || _b === void 0 ? void 0 : _b.appendChild(style);
    }
    updateOption(newValue) {
        if (!gameOptions.some(option => option === newValue))
            return;
        this.getFromContent('.component_image').src = gameOptionsLinks[newValue];
    }
    updateBgColor(newValue) {
        this.style.setProperty('--bgColor', newValue);
    }
    updateBorderColor(newValue) {
        this.style.setProperty('--borderColor', newValue);
    }
    attributeChangedCallback(attr, oldValue, newValue) {
        const attrActions = {
            'data-option': () => this.updateOption(newValue),
            'data-bgcolor': () => this.updateBgColor(newValue),
            'data-bordercolor': () => this.updateBorderColor(newValue)
        };
        if (!attrActions[attr])
            return;
        attrActions[attr]();
    }
}
customElements.define('rps-choose', RPSChoose);
