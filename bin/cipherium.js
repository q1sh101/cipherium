#!/usr/bin/env node

const { caesarCipher, symbolCipher, reverseCipher, vigenereCipher, base64Encode, base64Decode, sha256Hash } = require('../lib/encryptors');

// ANSI color codes (minimal set)
const color = {
  reset: '\x1b[0m',    // Reset styles
  red: '\x1b[31m',     // Errors
  green: '\x1b[32m',   // Success
  yellow: '\x1b[33m',  // Prompts
  cyan: '\x1b[36m'     // Menu/Results
};

// Applies color to text and resets afterward
function colorText(text, colorCode) {
  return `${colorCode}${text}${color.reset}`;
}

// Displays the main menu
function displayMenu() {
  process.stdout.write(`
${colorText('╔════════════════════════════════════════╗', color.cyan)}
${colorText('║           q1sh101 cipherium            ║', color.cyan)}
${colorText('╠════════════════════════════════════════╣', color.cyan)}
${colorText('║ 1. Caesar Cipher                       ║', color.green)}
${colorText('║ 2. Symbol Cipher                       ║', color.green)}
${colorText('║ 3. Reverse Cipher                      ║', color.green)}
${colorText('║ 4. Vigenère Cipher (Encode)            ║', color.green)} 
${colorText('║ 5. Vigenère Cipher (Decode)            ║', color.green)}
${colorText('║ 6. Super Encoder (Encode)              ║', color.green)}
${colorText('║ 7. Super Encoder (Decode)              ║', color.green)}
${colorText('║ 8. Base64 Encode                       ║', color.green)}
${colorText('║ 9. Base64 Decode                       ║', color.green)}
${colorText('║ 10. SHA256 Hash                        ║', color.green)}  
${colorText('║ 11. Exit                               ║', color.red)}  
${colorText('╚════════════════════════════════════════╝', color.cyan)}
${colorText('Choose an option (1-11): ', color.yellow)}`);
}

// Unified input handler
function getInput(prompt, callback) {
  process.stdout.write(colorText(prompt, color.yellow));
  process.stdin.once('data', (input) => {
    callback(input.toString().trim());
  });
}

// Retry/Exit logic
function askTryAgain() {
  getInput('Try again? (yes/no): ', (answer) => {
    const response = answer.toLowerCase();
    if (['yes', 'y'].includes(response)) {
      displayMenu();
      listenForMenuInput();
    } else if (['no', 'n'].includes(response)) {
      process.stdout.write(colorText('Goodbye!\n', color.red));
      process.exit();
    } else {
      process.stdout.write(colorText('Invalid response! Please enter "yes" or "no".\n', color.red));
      askTryAgain();
    }
  });
}

// Handles cipher execution with error handling
function executeCipher(cipherFn, message, params = {}) {
  try {
    const result = cipherFn(message, params);
    process.stdout.write(`\n${colorText('Result: ', color.green)}${colorText(result, color.cyan)}\n\n`);
    askTryAgain();
  } catch (error) {
    process.stdout.write(colorText(`Error: ${error.message}\n`, color.red));
    askTryAgain();
  }
}

// Menu handlers
function handleCaesarCipher() {
  getInput('Enter shift amount (integer): ', (amount) => {
    const shift = parseInt(amount, 10);
    if (isNaN(shift)) {
      process.stdout.write(colorText('Invalid shift! Must be an integer.\n', color.red));
      return handleCaesarCipher();
    }
    getInput('Enter message: ', (message) => executeCipher(caesarCipher, message, { amount: shift }));
  });
}

function handleSymbolCipher() {
  getInput('Enter message: ', (message) => executeCipher(symbolCipher, message));
}

function handleReverseCipher() {
  getInput('Enter message: ', (message) => executeCipher(reverseCipher, message));
}

function handleVigenereCipher(isDecode) {
  getInput('Enter key (letters only): ', (key) => {
    if (!key.match(/^[a-zA-Z]+$/)) {
      process.stdout.write(colorText('Invalid key! Must contain only letters.\n', color.red));
      return handleVigenereCipher(isDecode);
    }
    getInput('Enter message: ', (message) => executeCipher(vigenereCipher, message, { key, decrypt: isDecode }));
  });
}

function handleSuperCipher(isEncode) {
  const fn = isEncode ? (str) => reverseCipher(symbolCipher(caesarCipher(str, 5))) : (str) => caesarCipher(symbolCipher(reverseCipher(str)), -5);
  getInput(`Enter message to ${isEncode ? 'encode' : 'decode'}: `, (message) => executeCipher(fn, message));
}

function handleBase64(isEncode) {
  const fn = isEncode ? base64Encode : base64Decode;
  getInput(`Enter message to ${isEncode ? 'encode' : 'decode'} in Base64: `, (message) => executeCipher(fn, message));
}

function handleSHA256() {
  getInput('Enter message to hash with SHA256: ', (message) => executeCipher(sha256Hash, message));
}

// Menu input handler
function listenForMenuInput() {
  process.stdin.once('data', (choiceInput) => {
    const choice = choiceInput.toString().trim();
    switch (choice) {
      case '1': handleCaesarCipher(); break;
      case '2': handleSymbolCipher(); break;
      case '3': handleReverseCipher(); break;
      case '4': handleVigenereCipher(false); break;
      case '5': handleVigenereCipher(true); break;
      case '6': handleSuperCipher(true); break;
      case '7': handleSuperCipher(false); break;
      case '8': handleBase64(true); break;
      case '9': handleBase64(false); break;
      case '10': handleSHA256(); break;
      case '11': process.exit(); break;
      default:
        process.stdout.write(colorText('Invalid choice! Please select 1-11.\n', color.red));
        displayMenu();
        listenForMenuInput();
    }
  });
}

// Start program
function main() {
  displayMenu();
  listenForMenuInput();
}

main();