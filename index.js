let displayValue = "";

function setValue(keyValue) {
  displayValue += keyValue;
  document.getElementById("display").value = displayValue;
}

function clr() {
  displayValue = "";
  document.getElementById("display").value = displayValue;
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
  sqrt: 4,
};

function performOperation(operators, values) {
  const operator = operators.pop();
  const b = values.pop();
  const a = values.pop();
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
    case "sqrt":
      result = Math.sqrt(b);
      break;
  }
  values.push(result);
}

function calculateExpression(expression) {
  const operators = [];
  const values = [];

  let i = 0;
  while (i < expression.length) {
    const currentChar = expression[i];
    if (/\d|\./.test(currentChar)) {
      let number = "";
      while (i < expression.length && /\d|\./.test(expression[i])) {
        number += expression[i];
        i++;
      }
      values.push(parseFloat(number));
      continue;
    } else if (currentChar === "(") {
      operators.push(currentChar);
    } else if (currentChar === ")") {
      while (operators.length > 0 && operators[operators.length - 1] !== "(") {
        performOperation(operators, values);
      }
      operators.pop();
    } else if (/[+\-*/^]/.test(currentChar)) {
      while (
        operators.length > 0 &&
        operators[operators.length - 1] !== "(" &&
        precedence[operators[operators.length - 1]] >= precedence[currentChar]
      ) {
        performOperation(operators, values);
      }
      operators.push(currentChar);
    } else if (expression.substr(i, 3) === "sin") {
      operators.push("sin");
      i += 2;
    } else if (expression.substr(i, 3) === "cos") {
      operators.push("cos");
      i += 2;
    } else if (expression.substr(i, 3) === "tan") {
      operators.push("tan");
      i += 2;
    } else if (expression.substr(i, 4) === "sqrt") {
      operators.push("sqrt");
      i += 3;
    }
    i++;
  }

  while (operators.length > 0) {
    performOperation(operators, values);
  }

  return values[0];
}

let customVariables = [];
const variableButton = document.getElementById("variableButton");

variableButton.addEventListener("click", function () {
  let constant = document.getElementById("name-field").value;
  let value = document.getElementById("value-field").value;

  let newVariable = {
    constant: value,
  };

  customVariables.push(newVariable);
  //   console.log(customVariables[0].constant)
});

const calculateBtn = document.getElementById("calculateBtn");
let calculationHistory = [];

calculateBtn.addEventListener("click", function () {
  let expression = document.getElementById("display").value;
  //   expression += customVariables[0].constant

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
