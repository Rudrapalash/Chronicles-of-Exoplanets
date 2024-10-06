const questions = [
    {
        question: "What planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        answer: "Mars"
    },
    {
        question: "What is the name of our galaxy?",
        options: ["Andromeda", "Milky Way", "Sombrero", "Whirlpool"],
        answer: "Milky Way"
    },
    {
        question: "How many planets are in our solar system?",
        options: ["7", "8", "9", "10"],
        answer: "8"
    },
    {
        question: "What is the closest star to Earth?",
        options: ["Sirius", "Proxima Centauri", "Alpha Centauri", "Betelgeuse"],
        answer: "Proxima Centauri"
    },
];

let currentQuestionIndex = 0;
let score = 0;

const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('next-button');
const scoreElement = document.getElementById('score');

function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.classList.add('hidden');
    scoreElement.classList.add('hidden');
    showQuestion();
}

function showQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;
    optionsElement.innerHTML = '';

    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-button');
        button.addEventListener('click', () => selectOption(option));
        optionsElement.appendChild(button);
    });
}

function selectOption(option) {
    const currentQuestion = questions[currentQuestionIndex];
    if (option === currentQuestion.answer) {
        score++;
    }
    nextButton.classList.remove('hidden');
}

function showScore() {
    questionElement.classList.add('hidden');
    optionsElement.classList.add('hidden');
    nextButton.classList.add('hidden');
    scoreElement.innerText = `Your score: ${score} out of ${questions.length}`;
    scoreElement.classList.remove('hidden');
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        showScore();
    }
});

// Start the game
startGame();
