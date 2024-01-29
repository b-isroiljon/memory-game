const wrongAnswer = document.getElementById("wrongAudio");
const correctAnswer = document.getElementById("correctAudio");
const startButton = document.getElementById("start");
let rows = 1;
let cols = 4;
let delay = 1000;
let score = 0;
let opened = null;
let bestScore = 0;
let lives = 3;

const infoButton = document.getElementById("infoButton")
const infoModal = document.getElementById("infoModal")
const closer = document.querySelector(".close")

infoButton.addEventListener("click", () => {
  infoModal.style.display = "flex"
})


closer.addEventListener("click", () => {
  infoModal.style.display = "none"
})
window.addEventListener("click", (event) => {
  if(event.target == infoModal)infoModal.style.display = "none";
})






// TODO: need to check correctness
const generateNums = (rows, cols) => {
  const uniqs = {};
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

const createButtonsFromHtmlArray = (buttonArray) => {
  const container = document.querySelector(".grid-container");
  container.innerHTML = "";
  buttonArray.forEach((row) => {
    row.forEach((button) => {
      container.appendChild(button);
      setTimeout(() => {
        button.classList.toggle("hidden", false);
      }, delay);
      startGame();
    });
  });
};

const startGame = () => {
  startButton.addEventListener("click", () => {
    startButton.style.display = "none"
  const buttons = document.querySelectorAll(".grid-container .btn");
    buttons.forEach((button) => {
      setTimeout(() => {
      button.classList.toggle("hidden", true)
      button.addEventListener("click", handleOpenButton);
    }, delay);
    })
  });
}
const updateDisplay = () => {
  document.querySelector("#score").textContent = score;
  document.querySelector("#lives").innerHTML = "❤".repeat(lives);
  document.querySelector("#best-score").textContent = bestScore;
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

const showGameOverModal = () => {
  const modal = document.getElementById("modal");
  const restartButton = document.querySelector(".restart");
  modal.style.display = "flex";
  restartButton.addEventListener("click", () => {
    score = 0;
    lives = 3;
    rows = 1;
    gameInit();
    modal.style.display = "none";
  });
};

const checkTotalScore = () => {
  localStorage.setItem("bestScore", bestScore);
  if (lives === 0) setTimeout(showGameOverModal, 400);
};

const handleWrongButtons = (button) => {
  button.classList.toggle("wrong", true);
  opened.classList.toggle("wrong", true);
  lives--;
  setTimeout(() => resetButtons(button), 450);
  wrongAnswer.play();
  checkTotalScore();
};

const showCongrats = () => {
  const praise = document.querySelector(".congratulations");
  praise.classList.add("praise");
  setTimeout(() => praise.classList.remove("praise"), delay);
  startButton.style.display = "block"
};

const checkIfAllCorrect = () => {
  const buttons = document.querySelectorAll(".grid-container .btn");
  const isAllcorrect = Array.from(buttons).every((btn) =>
    btn.classList.contains("success")
  );

  if (!isAllcorrect) return;
  if (rows < 4) rows++;
  showCongrats();
  gameInit();
};

const handleSuccess = (button) => {
  button.classList.toggle("success", true);
  opened.classList.toggle("success", true);
  button.removeEventListener("click", handleOpenButton);
  opened.removeEventListener("click", handleOpenButton);
  score++;
  opened = null;
  if (score > bestScore) bestScore = score;
  checkIfAllCorrect();
  correctAnswer.play();
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
};

const handleOpenButton = (event) => {
  const button = event.target;
  if (button.classList.contains("shown")) return;
  button.classList.toggle("shown", true);
  button.classList.toggle("hidden", false);

  if (!opened) {
    opened = button;
  } else {
    secondButton(button);
  }
};


const gameInit = () => {
  setTimeout(() => {
    bestScore = localStorage.getItem("bestScore") || 0;
    const nums = generateNums(rows, cols);
    const buttons = createButton(nums);
    createButtonsFromHtmlArray(buttons);
    updateDisplay();
  }, delay);
};

document.addEventListener("DOMContentLoaded", gameInit);
