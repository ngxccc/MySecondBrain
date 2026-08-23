let currentQuestionIdx = 0;
let selectedOptionIdx = null;
let score = 0;
let hasSubmitted = false;

const questionInfoEl = document.getElementById("question-info");
const questionTextEl = document.getElementById("question-text");
const optionsListEl = document.getElementById("options-list");
const actionBtnEl = document.getElementById("action-btn");
const feedbackMsgEl = document.getElementById("feedback-msg");
const progressBarEl = document.getElementById("progress-bar");
const explanationBoxEl = document.getElementById("explanation-box");
const explanationTextEl = document.getElementById("explanation-text");

const quizScreenEl = document.getElementById("quiz-screen");
const resultsScreenEl = document.getElementById("results-screen");
const finalScoreEl = document.getElementById("final-score");
const resultMsgEl = document.getElementById("result-msg");

function loadQuestion() {
  hasSubmitted = false;
  selectedOptionIdx = null;
  actionBtnEl.disabled = true;
  actionBtnEl.textContent = "Submit";
  feedbackMsgEl.textContent = "Chọn câu trả lời và nhấn Submit";
  feedbackMsgEl.style.color = "var(--color-secondary)";
  explanationBoxEl.style.display = "none";

  const currentQ = questions[currentQuestionIdx];
  questionInfoEl.textContent = `QUESTION ${currentQuestionIdx + 1} OF ${questions.length}`;
  questionTextEl.textContent = currentQ.question;

  // Update progress bar
  const progressPercent = (currentQuestionIdx / questions.length) * 100;
  progressBarEl.style.width = `${progressPercent}%`;

  optionsListEl.innerHTML = "";
  currentQ.options.forEach((option, idx) => {
    const letter = String.fromCharCode(65 + idx); // A, B, C, D

    const optionItem = document.createElement("div");
    optionItem.className = "option-item";
    optionItem.onclick = () => selectOption(idx);

    optionItem.innerHTML = `
      <div class="option-letter">${letter}</div>
      <div class="option-text">${escapeHtml(option)}</div>
    `;

    optionsListEl.appendChild(optionItem);
  });
}

function selectOption(idx) {
  if (hasSubmitted) return;

  selectedOptionIdx = idx;
  actionBtnEl.disabled = false;

  const items = optionsListEl.querySelectorAll(".option-item");
  items.forEach((item, i) => {
    if (i === idx) {
      item.classList.add("selected");
    } else {
      item.classList.remove("selected");
    }
  });
  feedbackMsgEl.textContent = "Nhấn Submit để kiểm tra kết quả";
}

// Bind action button click
if (actionBtnEl) {
  actionBtnEl.onclick = () => {
    if (!hasSubmitted) {
      submitAnswer();
    } else {
      nextQuestion();
    }
  };
}

function submitAnswer() {
  hasSubmitted = true;
  const currentQ = questions[currentQuestionIdx];
  const items = optionsListEl.querySelectorAll(".option-item");

  items.forEach((item, i) => {
    item.classList.remove("selected");
    if (i === currentQ.correct) {
      item.classList.add("correct");
    } else if (i === selectedOptionIdx) {
      item.classList.add("incorrect");
    }
  });

  if (selectedOptionIdx === currentQ.correct) {
    score++;
    feedbackMsgEl.textContent = "Chính xác! Click Next để tiếp tục.";
    feedbackMsgEl.style.color = "var(--color-success)";
  } else {
    feedbackMsgEl.textContent = "Sai rồi! Click Next để tiếp tục.";
    feedbackMsgEl.style.color = "var(--color-error)";
  }

  // Show explanation
  explanationTextEl.textContent = currentQ.explanation;
  explanationBoxEl.style.display = "block";

  actionBtnEl.textContent = "Next";
}

function nextQuestion() {
  feedbackMsgEl.style.color = "var(--color-secondary)";
  currentQuestionIdx++;
  if (currentQuestionIdx < questions.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

function showResults() {
  progressBarEl.style.width = "100%";
  quizScreenEl.style.display = "none";
  resultsScreenEl.style.display = "block";
  finalScoreEl.textContent = score;

  const percentage = (score / questions.length) * 100;
  if (percentage === 100) {
    resultMsgEl.textContent =
      "Xuất sắc! Mày đã nắm rõ toàn bộ kiến thức ôn tập.";
  } else if (percentage >= 80) {
    resultMsgEl.textContent =
      "Rất tốt! Mày đã sẵn sàng cho các buổi làm việc thực tế.";
  } else if (percentage >= 50) {
    resultMsgEl.textContent = "Tạm ổn, nên đọc lại tài liệu để củng cố thêm.";
  } else {
    resultMsgEl.textContent = "Hãy ôn tập kỹ lại tài liệu để tránh bỡ ngỡ!";
  }
}

function restartQuiz() {
  currentQuestionIdx = 0;
  score = 0;
  quizScreenEl.style.display = "block";
  resultsScreenEl.style.display = "none";
  loadQuestion();
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Start on load
if (typeof questions !== "undefined" && questions.length > 0) {
  loadQuestion();
}
