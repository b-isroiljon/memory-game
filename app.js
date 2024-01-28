const buttons = [...document.querySelectorAll(".grid-container .btn")];
const restartButton = document.querySelector(".restart");
const modal = document.getElementById("modal");
const praise = document.querySelector(".congratulations");
const wrongAnswer = document.getElementById("wrongAudio");
const correctAnswer = document.getElementById("correctAudio");

let rows = 1;
const cols = 4;
const uniqs = {};
let opened = null;
let score = 0;
let lives = 3;
let bestScore = 0;
let delay = 1000;
let currentLevel = 0;

const generateNums = (rows, cols) => {
  const numOfUniqs = rows * 2;
  const nums = [];
  for (let i = 0; i < rows; i++) {
    let n = [];
    while (n.length < cols) {
      let num = Math.ceil(Math.random() * numOfUniqs);
      if (uniqs[num]) uniqs[num]++;
      else uniqs[num] = 1;
      if (uniqs[num] > 2) continue;
      n.push(num);
    }
    nums.push(n);
  }
  return nums;
};

const createButton = (nums) =>
  nums.map((row) =>
    row.map((num) => {
      const btn = document.createElement("button");
      btn.className = "btn";
      btn.innerHTML = num;
      return btn;
    })
  );

const nums = generateNums(rows, cols);
const buttonArray = createButton(nums);

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    bestScore = localStorage.getItem("bestScore") || 0;
    createButtonsFromHtmlArray(buttonArray);
    updateDisplay();
    gameInit();
  }, delay);
});

const createButtonsFromHtmlArray = (buttonArray) => {
  const container = document.querySelector(".grid-container");
  container.innerHTML = "";
  buttonArray.forEach((row) => {
    row.forEach((button) => {
      container.appendChild(button);
      setTimeout(() => {
        button.classList.toggle("hidden", true);
        button.addEventListener("click", openButton);
      }, delay);
    });
  });
};

const gameInit = () => {
  buttons.forEach((button) => {
    button.classList.toggle("hidden", true);
    button.addEventListener("click", openButton);
  });
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
  correctAnswer.play();
  opened = null;
  score++;
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

const checkAllButtons = () => {
  const buttonsArray = Array.from(
    document.querySelectorAll(".grid-container .btn")
  );

  const allButtonsShownSuccess = buttonsArray.every((button) =>
    button.classList.contains("success")
  );
  if (allButtonsShownSuccess) {
    rows++;
    praise.classList.add("praise");
    setTimeout(() => {
      buttonsArray.forEach((btn) => {
        btn.classList.remove("success", "wrong", "shown");
        setTimeout(() => {
          btn.classList.toggle("hidden", true);
          btn.addEventListener("click", openButton);
        }, delay);
      });
      praise.classList.remove("praise");

      createButtonsFromHtmlArray(buttonArray);
      console.log(rows);
    }, 1000);
  }
};

const updateDisplay = () => {
  document.querySelector("#score").textContent = score;
  document.querySelector("#lives").innerHTML = "❤".repeat(lives);
  document.querySelector("#best-score").textContent = bestScore;
};
