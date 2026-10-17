// UI code: connects the quiz logic (quiz.js) to the page (index.html).

const QUESTION_TIME_LIMIT = 15;
let state = createQuiz([]);
let timerIntervalId = null;
let questionResolved = false;

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const progressText = document.getElementById("progress");
const timeLeftText = document.getElementById("time-left");
const questionText = document.getElementById("question-text");
const optionsList = document.getElementById("options");
const feedbackText = document.getElementById("feedback");
const nextButton = document.getElementById("next-btn");
const scoreText = document.getElementById("score-text");
const gradeText = document.getElementById("grade-text");

function showScreen(screenToShow) {
  [startScreen, quizScreen, resultScreen].forEach((screen) => {
    screen.hidden = screen !== screenToShow;
  });
}

function startQuiz() {
  stopQuestionTimer();
  state = createQuiz(shuffle(QUESTIONS));
  showScreen(quizScreen);
  renderQuestion();
}

function renderQuestion() {
  stopQuestionTimer();
  questionResolved = false;
  const question = state.questions[state.current];
  progressText.textContent = `Question ${state.current + 1} of ${state.questions.length}`;
  questionText.textContent = question.question;
  feedbackText.textContent = "";
  nextButton.hidden = true;
  optionsList.innerHTML = "";

  question.options.forEach((option, index) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => selectAnswer(index, button));
    item.appendChild(button);
    optionsList.appendChild(item);
  });

  startQuestionTimer();
}

function startQuestionTimer() {
  let secondsLeft = QUESTION_TIME_LIMIT;
  updateTimerDisplay(secondsLeft);
  timerIntervalId = setInterval(() => {
    secondsLeft--;
    updateTimerDisplay(secondsLeft);
    if (secondsLeft === 0) completeQuestion(null, null, true);
  }, 1000);
}

function updateTimerDisplay(secondsLeft) {
  timeLeftText.textContent = formatTimeLeft(secondsLeft);
  timeLeftText.classList.toggle("timer--urgent", secondsLeft <= 5);
}

function stopQuestionTimer() {
  if (timerIntervalId !== null) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
}

function selectAnswer(selectedIndex, selectedButton) {
  completeQuestion(selectedIndex, selectedButton);
}

function completeQuestion(selectedIndex, selectedButton, timedOut = false) {
  if (questionResolved) return;
  questionResolved = true;
  stopQuestionTimer();

  const question = state.questions[state.current];
  const result = answerQuestion(state, timedOut ? null : selectedIndex);
  state = result.state;
  const buttons = optionsList.querySelectorAll("button");
  buttons.forEach((button) => (button.disabled = true));

  if (timedOut) {
    buttons[question.answer].classList.add("correct");
    feedbackText.textContent = getFeedbackMessage(false, true);
  } else if (result.correct) {
    selectedButton.classList.add("correct");
    feedbackText.textContent = getFeedbackMessage(true);
  } else {
    selectedButton.classList.add("wrong");
    buttons[question.answer].classList.add("correct");
    feedbackText.textContent = getFeedbackMessage(false);
  }

  nextButton.hidden = false;
  nextButton.focus();
}

function nextQuestion() {
  stopQuestionTimer();
  if (!isQuizFinished(state)) {
    renderQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  stopQuestionTimer();
  const total = state.questions.length;
  const percentage = calculatePercentage(state.score, total);
  scoreText.textContent = `You scored ${state.score} out of ${total} (${percentage}%)`;
  gradeText.textContent = `Grade: ${getGrade(percentage)}`;
  showScreen(resultScreen);
}

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("restart-btn").addEventListener("click", startQuiz);
nextButton.addEventListener("click", nextQuestion);
