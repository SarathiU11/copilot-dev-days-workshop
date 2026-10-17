// Tests use Node's built-in test runner, so nothing needs to be installed.
// Run them with:  npm test
const { test } = require("node:test");
const assert = require("node:assert/strict");
const {
  shuffle,
  isCorrect,
  calculatePercentage,
  formatTimeLeft,
  getFeedbackMessage,
  getGrade,
  createQuiz,
  answerQuestion,
  isQuizFinished,
} = require("../src/quiz.js");

test("createQuiz initializes a fresh state from questions", () => {
  const questions = [{ answer: 1 }];
  const state = createQuiz(questions);

  assert.deepEqual(state, { questions, current: 0, score: 0 });
  assert.notEqual(state.questions, questions);
});

test("answerQuestion advances and scores a correct answer without mutating state", () => {
  const state = { questions: [{ answer: 1 }], current: 0, score: 0 };
  const result = answerQuestion(state, 1);

  assert.deepEqual(result, {
    state: { questions: state.questions, current: 1, score: 1 },
    correct: true,
  });
  assert.deepEqual(state, { questions: [{ answer: 1 }], current: 0, score: 0 });
});

test("answerQuestion advances without scoring an incorrect answer", () => {
  const state = { questions: [{ answer: 1 }], current: 0, score: 2 };

  assert.deepEqual(answerQuestion(state, 0), {
    state: { questions: state.questions, current: 1, score: 2 },
    correct: false,
  });
});

test("isQuizFinished returns false before the final answer", () => {
  assert.equal(isQuizFinished({ questions: [{}, {}], current: 1 }), false);
});

test("isQuizFinished returns true after the final answer", () => {
  assert.equal(isQuizFinished({ questions: [{}], current: 1 }), true);
});

test("isCorrect returns true for the right answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 2), true);
});

test("isCorrect returns false for a wrong answer", () => {
  assert.equal(isCorrect({ answer: 2 }, 0), false);
});

test("calculatePercentage rounds to a whole number", () => {
  assert.equal(calculatePercentage(2, 3), 67);
});

test("calculatePercentage returns 0 when there are no questions", () => {
  assert.equal(calculatePercentage(0, 0), 0);
});

test("formatTimeLeft formats remaining seconds", () => {
  assert.equal(formatTimeLeft(12), "⏱ 12s");
});

test("formatTimeLeft formats zero seconds", () => {
  assert.equal(formatTimeLeft(0), "⏱ 0s");
});

test("shuffle keeps every item and does not change the original array", () => {
  const original = [1, 2, 3, 4, 5];
  const result = shuffle(original);
  assert.deepEqual([...result].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual(original, [1, 2, 3, 4, 5]);
});

test("getGrade gives an A when the percentage is exactly 90", () => {
  assert.equal(getGrade(90), "A");
});

test("getGrade gives a B when the percentage is exactly 75", () => {
  assert.equal(getGrade(75), "B");
});

test("getGrade gives a C when the percentage is exactly 50", () => {
  assert.equal(getGrade(50), "C");
});

test("getFeedbackMessage returns the success message for a correct answer", () => {
  assert.equal(getFeedbackMessage(true), "Correct!");
});

test("getFeedbackMessage returns the retry message for an incorrect answer", () => {
  assert.equal(getFeedbackMessage(false), "Not quite. The correct answer is highlighted.");
});

test("getFeedbackMessage returns the timeout message when time runs out", () => {
  assert.equal(getFeedbackMessage(false, true), "Time's up!");
});
