
// Input range element to target or take password length input
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");

// Password copy button section 
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

// All checkboxes accessing individualy
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

// Password strength indicator
const indicator = document.querySelector("[data-indicator]");
const strengthText = document.querySelector("[data-strengthText]");
const generateBtn = document.querySelector(".generateBtn");

// All check boxes
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`! @#$%^&*()_-+={[}]|\\:;"<,>.?/';

// Initially 
let password = "";
let passwordLength = 10;
let checkCount = 0;

handleSlider();
setIndicator("#ccc");

// Set passwordLength and update slider appearance
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;

    // FIXED: Proper gradient calculation for slider
    const percentage = ((passwordLength - min) * 100) / (max - min);
    inputSlider.style.background = `linear-gradient(to right, hsl(290, 70%, 36%) 0%, hsl(290, 70%, 36%) ${percentage}%, hsl(268, 47%, 21%) ${percentage}%, hsl(268, 47%, 21%) 100%)`;
}

// Set color password indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Get random integer number
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Generate random number
function generateRandomNumber() {
    return getRndInteger(0, 9);
}

// Generate lowercase letter
function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

// Generate uppercase letter
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

// Generate random symbols 
function generateSymbols() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

// Calculate password strength
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
        strengthText.innerText = "Strong";
    } else if (
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
        strengthText.innerText = "Moderate";
    } else {
        setIndicator("#f00");
        strengthText.innerText = "Weak";
    }
}

// FIXED: Copy content function
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied!";
    } catch (err) {
        copyMsg.innerText = "Failed";
    }

    // Show tooltip
    copyMsg.classList.add("active");

    // Hide tooltip after 2 seconds
    setTimeout(() => {
        copyMsg.classList.remove("active");
        copyMsg.innerText = "Copy"; // Reset to original text
    }, 2000);
}

// Shuffle password using Fisher Yates Method
function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((ele) => str += ele);
    return str;
}

// Handle checkbox count
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    // Special case
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

// Event listeners for checkboxes
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
});

// Event listener for slider
inputSlider.addEventListener("input", (event) => {
    passwordLength = event.target.value;
    handleSlider();
});

// Event listener for copy button
copyBtn.addEventListener("click", () => {
    if (passwordDisplay.value) {
        copyContent();
    }
});

// Event listener for generate password button
generateBtn.addEventListener("click", () => {
    // None of the checkbox are selected
    if (checkCount <= 0) return;

    // Special case
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Clear old password
    password = "";

    // Create function array based on selected checkboxes
    let funArr = [];

    if (uppercaseCheck.checked) {
        funArr.push(generateUpperCase);
    }
    if (lowercaseCheck.checked) {
        funArr.push(generateLowerCase);
    }
    if (numberCheck.checked) {
        funArr.push(generateRandomNumber);
    }
    if (symbolsCheck.checked) {
        funArr.push(generateSymbols);
    }

    // FIXED: Compulsory addition - use correct index
    for (let i = 0; i < funArr.length; i++) {
        password += funArr[i](); // Changed from funArr[0]() to funArr[i]()
    }

    // Remaining addition
    for (let i = 0; i < passwordLength - funArr.length; i++) {
        let randIndex = getRndInteger(0, funArr.length);
        password += funArr[randIndex]();
    }

    // Shuffle the password
    password = shufflePassword(Array.from(password));

    // Display password and calculate strength
    passwordDisplay.value = password;
    calcStrength();
});