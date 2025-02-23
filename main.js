// main.js - Main terminal interface for Matrix Cyberpuck Encryptor

const { caesarCipher, symbolCipher, reverseCipher } = require('./encryptors');

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
${colorText('║       q1sh101 Message Encryptor        ║', color.cyan)}
${colorText('╠════════════════════════════════════════╣', color.cyan)}
${colorText('║ 1. Caesar Cipher                       ║', color.green)}
${colorText('║ 2. Symbol Cipher                       ║', color.green)}
${colorText('║ 3. Reverse Cipher                      ║', color.green)}
${colorText('║ 4. Super Encoder (Encode)              ║', color.green)}
${colorText('║ 5. Super Encoder (Decode)              ║', color.green)}
${colorText('║ 6. Exit                                ║', color.red)}
${colorText('╚════════════════════════════════════════╝', color.cyan)}
${colorText('Choose an option (1-6): ', color.yellow)}`);
}

// Handles Caesar Cipher logic
function handleCaesarCipher() {
  process.stdout.write(colorText('Enter shift amount: ', color.yellow));
  process.stdin.once('data', (amountInput) => {
    const amount = parseInt(amountInput.toString().trim(), 10);
    
    if (isNaN(amount)) {
      process.stdout.write(colorText('Invalid number! Try again.\n', color.red));
      handleCaesarCipher(); // Recursive retry
      return;
    }

    process.stdout.write(colorText('Enter message: ', color.yellow));
    process.stdin.once('data', (messageInput) => {
      const message = messageInput.toString().trim();
      const result = caesarCipher(message, amount);
      process.stdout.write(`\n${colorText('Result: ', color.green)}${colorText(result, color.cyan)}\n\n`);
      askTryAgain();
    });
  });
}

// Handles Symbol Cipher logic (same pattern for Reverse Cipher)
function handleSymbolCipher() {
  process.stdout.write(colorText('Enter message: ', color.yellow));
  process.stdin.once('data', (messageInput) => {
    const message = messageInput.toString().trim();
    const result = symbolCipher(message);
    process.stdout.write(`\n${colorText('Result: ', color.green)}${colorText(result, color.cyan)}\n\n`);
    askTryAgain();
  });
}

// Super Encoder/Decoder
const CAESAR_SHIFT = 5; // shift value for consistency

function encodeMessage(str) {
  return reverseCipher(          // Step 3: Reverse
    symbolCipher(                // Step 2: Symbols
      caesarCipher(str, CAESAR_SHIFT) // Step 1: Caesar
    )
  );
}

function decodeMessage(str) {
  return caesarCipher(           // Step 3: Reverse Caesar
    symbolCipher(                // Step 2: Symbols (self-inverse)
      reverseCipher(str)         // Step 1: Reverse
    ), 
    -CAESAR_SHIFT
  );
}

// Unified handler for Super Encoder/Decoder
function handleSuperCipher(isEncode) {
  process.stdout.write(colorText(`Enter message to ${isEncode ? 'encode' : 'decode'}: `, color.yellow));
  process.stdin.once('data', (messageInput) => {
    const message = messageInput.toString().trim();
    const result = isEncode ? encodeMessage(message) : decodeMessage(message);
    process.stdout.write(`\n${colorText('Result: ', color.green)}${colorText(result, color.cyan)}\n\n`);
    askTryAgain();
  });
}

// Retry/Exit logic
function askTryAgain() {
  process.stdout.write(colorText('Try again? (yes/no): ', color.yellow));
  process.stdin.once('data', (answer) => {
    const response = answer.toString().trim().toLowerCase();
    if (['yes', 'y'].includes(response)) {
      displayMenu();
      listenForMenuInput();
    } else if (['no', 'n'].includes(response)) {
      process.stdout.write(colorText('See you!\n', color.red));
      process.exit();
    } else {
      process.stdout.write(colorText('Invalid response!\n', color.red));
      askTryAgain(); // Recursive retry
    }
  });
}

// Menu input handler
function listenForMenuInput() {
  process.stdin.once('data', (choiceInput) => {
    const choice = choiceInput.toString().trim();
    switch(choice) {
      case '1': handleCaesarCipher(); break;
      case '2': handleSymbolCipher(); break;
      case '3': 
        process.stdout.write(colorText('Enter message: ', color.yellow));
        process.stdin.once('data', (msg) => {
          const result = reverseCipher(msg.toString().trim());
          process.stdout.write(`\n${colorText('Result: ', color.green)}${colorText(result, color.cyan)}\n\n`);
          askTryAgain();
        });
        break;
      case '4': handleSuperCipher(true); break;
      case '5': handleSuperCipher(false); break;
      case '6': process.exit(); break;
      default:
        process.stdout.write(colorText('Invalid choice!\n', color.red));
        displayMenu();
        listenForMenuInput(); // Reset listener
    }
  });
}

// Start program
function main() {
  displayMenu();
  listenForMenuInput();
}

main();