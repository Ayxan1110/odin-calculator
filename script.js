// Basic math functions
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function multiply(a, b) {
  return a * b;
}

function divide(a, b) {
  return a / b;
}

function operate(operator, a, b) {
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "*":
      return multiply(a, b);
    case "/":
      return divide(a, b);
  }
}

// The calculator remembers: first number, operator, second number
let firstNumber = null;
let operator = null;
let currentInput = "0";
let shouldResetInput = false; // true right after an operator or "=" is pressed

const display = document.querySelector("#display");
const operatorButtons = document.querySelectorAll(".operator");

function updateDisplay(value) {
  display.textContent = value;
}

// rounds long decimals so they fit on the screen, e.g. 2 / 3 = 0.66666667
function roundResult(number) {
  return Math.round(number * 100000000) / 100000000;
}

function highlightOperator(op) {
  operatorButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.operator === op);
  });
}

function inputDigit(digit) {
  if (currentInput === "0" || shouldResetInput) {
    currentInput = digit;
    shouldResetInput = false;
  } else {
    currentInput += digit;
  }
  highlightOperator(null);
  updateDisplay(currentInput);
}

function inputDecimal() {
  if (shouldResetInput) {
    currentInput = "0";
    shouldResetInput = false;
  }
  if (!currentInput.includes(".")) {
    currentInput += ".";
  }
  updateDisplay(currentInput);
}

function calculate() {
  const secondNumber = Number(currentInput);

  if (operator === "/" && secondNumber === 0) {
    clear();
    updateDisplay("Nice try 😉");
    return false;
  }

  const result = roundResult(operate(operator, firstNumber, secondNumber));
  currentInput = String(result);
  updateDisplay(currentInput);
  return true;
}

function chooseOperator(op) {
  // if we already have "12 + 7", calculate it first, so 12 + 7 - shows 19
  // (if two operators are pressed in a row, we skip this and only change the operator)
  if (operator !== null && !shouldResetInput) {
    if (!calculate()) return;
  }
  firstNumber = Number(currentInput);
  operator = op;
  shouldResetInput = true;
  highlightOperator(op);
}

function equals() {
  // do nothing if we do not have both numbers yet
  if (operator === null || shouldResetInput) return;
  if (!calculate()) return;
  firstNumber = null;
  operator = null;
  shouldResetInput = true;
  highlightOperator(null);
}

function clear() {
  firstNumber = null;
  operator = null;
  currentInput = "0";
  shouldResetInput = false;
  highlightOperator(null);
  updateDisplay(currentInput);
}

function backspace() {
  if (shouldResetInput) return;
  currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : "0";
  updateDisplay(currentInput);
}

// Mouse clicks
document.querySelector(".buttons").addEventListener("click", (event) => {
  const button = event.target;
  if (button.dataset.digit) inputDigit(button.dataset.digit);
  if (button.dataset.operator) chooseOperator(button.dataset.operator);
  if (button.dataset.action === "decimal") inputDecimal();
  if (button.dataset.action === "equals") equals();
  if (button.dataset.action === "clear") clear();
  if (button.dataset.action === "backspace") backspace();
});

// Keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key;
  if (key >= "0" && key <= "9") inputDigit(key);
  if (["+", "-", "*", "/"].includes(key)) chooseOperator(key);
  if (key === ".") inputDecimal();
  if (key === "Enter" || key === "=") {
    event.preventDefault();
    equals();
  }
  if (key === "Backspace") backspace();
  if (key === "Escape") clear();
});
