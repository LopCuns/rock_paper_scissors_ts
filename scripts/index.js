import './components/choose.component.js';
import randomBetween from './utilities/randomBetween.js';
// Get the global DOM elements
const $main = document.getElementById('main');
const $firstRPS = document.querySelector('rps-choose');
const $secondRPS = document.querySelectorAll('rps-choose')[1];
const $lastRPS = document.querySelectorAll('rps-choose')[2];
const $resultsTitle = document.getElementById('resultsTitle');
const defaultTitle = $resultsTitle.textContent;
const $restartBtn = document.getElementById('restartBtn');
// Game variables
const winCases = {
    'rock': 'scissors',
    'scissors': 'paper',
    'paper': 'rock'
};
const gameOptions = ['rock', 'paper', 'scissors'];
// Game functions
const checkGameOption = (option) => {
    return gameOptions.some(opt => opt === option);
};
const hasWon = (input1, input2) => {
    if (winCases[input1] === input2)
        return true;
    return false;
};
const checkDraw = (input1, input2) => {
    if (input1 === input2)
        return true;
    return false;
};
const calcResults = (input1, input2) => {
    // Check if it has been a draw
    if (checkDraw(input1, input2))
        return 'Draw';
    // Check if user has won
    if (hasWon(input1, input2))
        return 'User has won';
    // If there is neither a draw nor a user win, then the house has won
    return 'The house has won';
};
const hideShowElement = (element, hideClass = 'hidden') => {
    element.classList.toggle(hideClass);
};
const animateGame = () => {
    // Set fadeLeft to first RPS
    $firstRPS.classList.add('intrigueFadeLeft');
    // Set fadeRight to second RPS
    $secondRPS.classList.add('intrigueFadeRight');
};
const endAnimation = () => {
    // Delete animationClasses
    $firstRPS.classList.remove('intrigueFadeLeft');
    $secondRPS.classList.remove('intrigueFadeRight');
};
const showResults = (userSelection, machineSelection) => {
    var _a;
    // Hide the last option
    $lastRPS.classList.add('hidden');
    // Change the first image
    $firstRPS.setAttribute('data-option', userSelection);
    // Hide the second image (Where machineSelection will be shown)
    const $secondRPSImage = (_a = $secondRPS.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('.component_image');
    hideShowElement($secondRPSImage);
    // Animate the game
    animateGame();
    setTimeout(() => {
        // Change the second image
        $secondRPS.setAttribute('data-option', machineSelection);
        // Show the second image
        hideShowElement($secondRPSImage);
        // Update the resultsTitle
        $resultsTitle.textContent = calcResults(userSelection, machineSelection);
        endAnimation();
    }, 1000);
};
// Function to be used in the event listener
function playGame(e) {
    // Check if element is a game option element
    const $rpschoose = e.target;
    if ($rpschoose.tagName !== 'RPS-CHOOSE')
        return;
    // Check if selected option is valid
    const userOption = $rpschoose.getAttribute('data-option') || '';
    if (!checkGameOption(userOption))
        return;
    // Take a random response
    const machineResponse = gameOptions[randomBetween(0, 2)];
    // Show the game result
    showResults(userOption, machineResponse);
    // Show the play again button
    hideShowElement($restartBtn);
    $main.removeEventListener('click', playGame);
}
function restartGame() {
    // Show the third RPS
    hideShowElement($lastRPS);
    // Change the RPS images
    $firstRPS.setAttribute('data-option', 'rock');
    $secondRPS.setAttribute('data-option', 'paper');
    // Hide the restart button
    hideShowElement($restartBtn);
    // Change results title to default
    $resultsTitle.textContent = defaultTitle;
    // Add again the event listener to play
    $main.addEventListener('click', playGame);
}
// Interactivity
$main.addEventListener('click', playGame);
$restartBtn.addEventListener('click', restartGame);
