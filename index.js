let displayValue = "";
let newVariable = {};

function setValue(keyValue) {
  let key = document.getElementById("display").value;
  displayValue = key;
  displayValue += keyValue;
  document.getElementById("display").value = displayValue;
}

function clr() {
  displayValue = "";
  document.getElementById("display").value = "";
  document.getElementById("name-field").value = "";
  document.getElementById("value-field").value = "";
}

const precedence = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "^": 3,
  sin: 4,
  cos: 4,
  tan: 4,
  sqr: 4,
};

function performOperation(operators, stack) {
  const operator = operators.pop();
  const b = stack.pop();
  const a = stack.pop();
  let result;
  switch (operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      result = a / b;
      break;
    case "^":
      result = Math.pow(a, b);
      break;
    case "sin":
      result = Math.sin(b);
      break;
    case "cos":
      result = Math.cos(b);
      break;
    case "tan":
      result = Math.tan(b);
      break;
    case "sqr":
      result = Math.sqrt(b);
      break;
  }
  stack.push(result);
}

function calculateExpression(expression) {
  const operators = [];
  const stack = [];

  let i = 0;
  while (i < expression.length) {
    const numRegex = /\d|\./;
    const charRegex = /[A-Za-z]/;
    const operatorRegex = /[+\-*/^]/;

    const currentChar = expression[i];

    if (numRegex.test(currentChar)) {
      let number = "";
      while (i < expression.length && numRegex.test(expression[i])) {
        number += expression[i];
        i++;
      }
      stack.push(parseFloat(number));
      continue;
    } else if (
      charRegex.test(currentChar) &&
      expression.substr(i, 3) !== "sin" &&
      expression.substr(i, 3) !== "cos" &&
      expression.substr(i, 3) !== "tan" &&
      expression.substr(i, 3) !== "sqr"
    ) {
      let variable = "";
      while (i < expression.length && charRegex.test(expression[i])) {
        let item = expression[i];
        variable += newVariable[item];
        i++;
      }
      stack.push(parseFloat(variable));
      continue;
    } else if (currentChar === "(") {
      operators.push(currentChar);
    } else if (currentChar === ")") {
      while (operators.length > 0 && operators[operators.length - 1] !== "(") {
        performOperation(operators, stack);
      }
      operators.pop();
    } else if (operatorRegex.test(currentChar)) {
      while (
        operators.length > 0 &&
        operators[operators.length - 1] !== "(" &&
        precedence[operators[operators.length - 1]] >= precedence[currentChar]
      ) {
        performOperation(operators, stack);
      }
      operators.push(currentChar);
    } else if (
      expression.substr(i, 3) === "sin" ||
      expression.substr(i, 3) === "cos" ||
      expression.substr(i, 3) === "tan" ||
      expression.substr(i, 3) === "sqr"
    ) {
      let substr = expression.substr(i, 3);
      operators.push(substr);
      i += 2;
    }

    i++;
  }

  while (operators.length > 0) {
    performOperation(operators, stack);
  }

  return stack[0];
}

const variableButton = document.getElementById("variableButton");

variableButton.addEventListener("click", function () {
  let variable = document.getElementById("name-field").value;
  let value = document.getElementById("value-field").value;
  let alert = document.getElementById("myAlert");

  if (!newVariable.hasOwnProperty(variable)) {
    newVariable = {
      ...newVariable,
      [variable]: value,
    };
  } else {
    alert.style.display = "block";
  }
});

const calculateBtn = document.getElementById("calculateBtn");
let calculationHistory = [];

calculateBtn.addEventListener("click", function () {
  let expression = document.getElementById("display").value;

  try {
    const result = calculateExpression(expression);
    if (isNaN(result)) {
      document.getElementById("display").value = "Invalid";
      throw new Error("Invalid");
    }
    document.getElementById("display").value = result.toFixed(4);
    showHistory(expression, result);
  } catch (error) {
    console.log(error);
  }
});

function showHistory(expression, result) {
  const calculation = {
    expression: expression,
    result: result,
  };
  calculationHistory.push(calculation);

  const historyDiv = document.getElementById("history_data");
  historyDiv.innerHTML = "";

  calculationHistory.forEach((calculation) => {
    const expression = calculation.expression;
    const result = calculation.result;

    const calculationElement = document.createElement("p");
    calculationElement.textContent = `${expression} = ${result.toFixed(4)}`;

    historyDiv.appendChild(calculationElement);
  });
}

const deleteHist = document.getElementById("delete");

deleteHist.addEventListener("click", function () {
  calculationHistory = [];
  const historyDiv = document.getElementById("history_data");
  historyDiv.innerHTML = "";
});
