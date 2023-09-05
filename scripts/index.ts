import './components/choose.component.js'
import randomBetween  from './utilities/randomBetween.js'
// Get the global DOM elements
const $main : HTMLElement = document.getElementById('main') as HTMLElement
const $firstRPS : HTMLElement = document.querySelector('rps-choose') as HTMLElement
const $secondRPS : HTMLElement = document.querySelectorAll('rps-choose')[1] as HTMLElement
const $lastRPS : HTMLElement = document.querySelectorAll('rps-choose')[2] as HTMLElement
const $resultsTitle : HTMLElement = document.getElementById('resultsTitle') as HTMLElement
const defaultTitle : string = $resultsTitle.textContent as string
const $restartBtn : HTMLButtonElement = document.getElementById('restartBtn') as HTMLButtonElement

// Game variables
const winCases : { [index : string] : string } = {
  'rock' : 'scissors',
  'scissors' : 'paper',
  'paper' : 'rock'
}
const gameOptions = ['rock','paper','scissors'] as const

// Game types
type gameOption =  typeof gameOptions[number]
type gameFunc = (arg1 : gameOption, agr2 : gameOption) => boolean

// Game functions
const checkGameOption = (option : string) : option is gameOption => {
  return gameOptions.some(opt => opt === option)
}


const hasWon : gameFunc = (input1, input2) => {
  if (winCases[input1] === input2) return true
  return false
}

const checkDraw : gameFunc = (input1,input2) => {
  if(input1 === input2) return true
  return false
}

const calcResults = (input1 : gameOption, input2 : gameOption) : string => {
    // Check if it has been a draw
    if(checkDraw(input1,input2)) return 'Draw'
    // Check if user has won
    if(hasWon(input1,input2)) return 'User has won'
    // If there is neither a draw nor a user win, then the house has won
     return 'The house has won'
}

const hideShowElement = <Type extends HTMLElement>(element : Type,hideClass = 'hidden') : void => {
  element.classList.toggle(hideClass)
}

const animateGame = () : void => {
  // Set fadeLeft to first RPS
  $firstRPS.classList.add('intrigueFadeLeft')
  // Set fadeRight to second RPS
  $secondRPS.classList.add('intrigueFadeRight')
}
const endAnimation = () : void => {
  // Delete animationClasses
  $firstRPS.classList.remove('intrigueFadeLeft')
  $secondRPS.classList.remove('intrigueFadeRight')
}

const showResults = (userSelection : gameOption,machineSelection : gameOption) : void => {
  // Hide the last option
  $lastRPS.classList.add('hidden')
  // Change the first image
  $firstRPS.setAttribute('data-option',userSelection);
  // Hide the second image (Where machineSelection will be shown)
  const $secondRPSImage : HTMLImageElement = $secondRPS.shadowRoot?.querySelector('.component_image') as HTMLImageElement
  hideShowElement($secondRPSImage)
  // Animate the game
  animateGame()
  setTimeout(()=>{
    // Change the second image
    $secondRPS.setAttribute('data-option',machineSelection)
    // Show the second image
    hideShowElement($secondRPSImage)
    // Update the resultsTitle
    $resultsTitle.textContent = calcResults(userSelection,machineSelection)
    endAnimation()
  },1000)
}

// Function to be used in the event listener

function playGame(e : Event) : void {
  // Check if element is a game option element
  const $rpschoose = e.target as HTMLElement
  if($rpschoose.tagName !== 'RPS-CHOOSE') return
  // Check if selected option is valid
  const userOption : string = $rpschoose.getAttribute('data-option') || ''
  if(!checkGameOption(userOption)) return
  // Take a random response
  const machineResponse : gameOption = gameOptions[randomBetween(0,2)]
  // Show the game result
  showResults(userOption,machineResponse)
  // Show the play again button
  hideShowElement($restartBtn)
  $main.removeEventListener('click',playGame)
}

function restartGame () : void {
  // Show the third RPS
  hideShowElement($lastRPS)
  // Change the RPS images
  $firstRPS.setAttribute('data-option','rock')
  $secondRPS.setAttribute('data-option','paper')
  // Hide the restart button
  hideShowElement($restartBtn)
  // Change results title to default
  $resultsTitle.textContent = defaultTitle
  // Add again the event listener to play
  $main.addEventListener('click',playGame)
}

// Interactivity
$main.addEventListener('click',playGame)
$restartBtn.addEventListener('click',restartGame)