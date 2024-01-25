const buttons = [...document.querySelectorAll(".grid-container .btn")];
const restartButton = document.querySelector(".restart");
const modal = document.getElementById("modal");
const praise = document.querySelector(".congratulations");
const wrongAnswer = document.getElementById("wrongAudio");
const correctAnswer = document.getElementById("correctAudio");

let numbers = [];
let opened = null;
let score = 0;
let lives = 3;
let bestScore = 0;
let delay = 1000;

document.addEventListener("DOMContentLoaded", () =>
  setTimeout(() => {
    bestScore = localStorage.getItem("bestScore") || 0;
    updateDisplay();
    gameInit();
  }, delay)
);

const newButtons = () => {};

const resetRandomtSet = () => {
  numbers = [1, 1, 2, 2];
};

// Функция для обновления цифр на кнопках
const randomButtons = () => {
  if (numbers.length < 2) resetRandomtSet();
  buttons.forEach((button) => {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    button.textContent = numbers[randomIndex];
    numbers.splice(randomIndex, 1);
  });
  resetRandomtSet();
};

const gameInit = () => {
  setTimeout(() => {
    buttons.forEach((button) => {
      button.classList.toggle("hidden", true);
      button.addEventListener("click", openButton);
    });
  }, delay);
};

const openButton = (event) => {
  const button = event.target;
  if (button.classList.contains("shown")) return;
  button.classList.toggle("shown", true);
  button.classList.toggle("hidden", false);

  if (!opened) {
    firstButton(button);
  } else {
    secondButton(button);
  }
};

const firstButton = (button) => {
  opened = button;
};

const secondButton = (button) => {
  const firstButtonNumber = parseInt(opened.textContent);
  const secondButtonNumber = parseInt(button.textContent);
  if (firstButtonNumber === secondButtonNumber) {
    handleSuccess(button);
  } else {
    handleWrongButtons(button);
  }
  updateDisplay();
  checkAllButtons();
};

const handleSuccess = (button) => {
  button.classList.toggle("success", true);
  opened.classList.toggle("success", true);
  button.removeEventListener("click", openButton);
  opened.removeEventListener("click", openButton);
  opened = null;
  score++;
  correctAnswer.play();
};

const handleWrongButtons = (button) => {
  button.classList.toggle("wrong", true);
  opened.classList.toggle("wrong", true);
  lives--;
  setTimeout(() => resetButtons(button), 500);
  wrongAnswer.play();
  checkTotalScore();
};

const resetButtons = (button) => {
  // close first
  opened.classList.toggle("hidden", true);
  opened.classList.toggle("shown", false);
  opened.classList.toggle("wrong");
  // close second
  button.classList.toggle("hidden", true);
  button.classList.toggle("shown", false);
  button.classList.toggle("wrong");

  opened = null;
};

const checkTotalScore = () => {
  if (score > bestScore) bestScore = score;
  localStorage.setItem("bestScore", bestScore);
  if (lives === 0) showGameOverModal();
};

const resetGame = () => {
  buttons.forEach((btn) => {
    btn.classList.remove("success", "wrong");
    btn.classList.remove("hidden");
  });
  score = 0;
  lives = 3;
  updateDisplay();
  gameInit();
};

const showGameOverModal = () => {
  modal.style.display = "flex";
  restartButton.addEventListener("click", () => {
    resetGame();

    modal.style.display = "none";
  });
};

const updateDisplay = () => {
  document.querySelector("#score").textContent = score;
  document.querySelector("#lives").innerHTML = "❤".repeat(lives);
  document.querySelector("#best-score").textContent = bestScore;
};

const checkAllButtons = () => {
  const allButtonsShownSuccess = buttons.every((button) =>
    button.classList.contains("success")
  );
  if (allButtonsShownSuccess) {
    praise.classList.add("praise");
    setTimeout(() => {
      continueWithScore();
      praise.classList.remove("praise");
    }, 1000);
  }
  console.log(allButtonsShownSuccess);
};

const continueWithScore = () => {
  setTimeout(() => {
    buttons.forEach((btn) => {
      btn.classList.remove("success", "wrong");
      btn.classList.toggle("shown", false);
    }, 600);
  });
  gameInit();
  randomButtons();
};
