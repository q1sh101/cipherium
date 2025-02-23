const { caesarCipher, symbolCipher, reverseCipher, vigenereCipher } = require('./encryptors');
const crypto = require('crypto');  // Import crypto module for SHA256
const Buffer = require('buffer').Buffer;  // Import Buffer for Base64

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

// Base64 Encoding Function
function base64Encode(str) {
  if (!str) throw new Error('Input string is required for Base64 encoding.');
  return Buffer.from(str).toString('base64');
}

// Base64 Decoding Function
function base64Decode(str) {
  if (!str) throw new Error('Input string is required for Base64 decoding.');
  try {
    return Buffer.from(str, 'base64').toString('utf-8'); // Convert base64 to string
  } catch (error) {
    throw new Error('Invalid Base64 input.');
  }
}

// SHA256 Hashing Function
function sha256Hash(str) {
  if (!str) throw new Error('Input string is required for SHA-256 hashing.');
  return crypto.createHash('sha256').update(str).digest('hex');
}

// Displays the main menu
function displayMenu() {
  process.stdout.write(`
${colorText('╔════════════════════════════════════════╗', color.cyan)}
${colorText('║           q1sh101 Cipherium            ║', color.cyan)}
${colorText('╠════════════════════════════════════════╣', color.cyan)}
${colorText('║ 1. Caesar Cipher                       ║', color.green)}
${colorText('║ 2. Symbol Cipher                       ║', color.green)}
${colorText('║ 3. Reverse Cipher                      ║', color.green)}
${colorText('║ 4. Vigenère Cipher                     ║', color.green)} 
${colorText('║ 5. Super Encoder (Encode)              ║', color.green)}
${colorText('║ 6. Super Encoder (Decode)              ║', color.green)}
${colorText('║ 7. Base64 Encode/Decode                ║', color.green)}
${colorText('║ 8. SHA256 Hash                         ║', color.green)}  
${colorText('║ 9. Exit                                ║', color.red)}  
${colorText('╚════════════════════════════════════════╝', color.cyan)}
${colorText('Choose an option (1-9): ', color.yellow)}`);
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
      try {
        const result = caesarCipher(message, amount);
        process.stdout.write(`\n${colorText('Result: ', color.green)}${colorText(result, color.cyan)}\n\n`);
      } catch (error) {
        process.stdout.write(colorText(`Error: ${error.message}\n`, color.red));
      }
      askTryAgain();
    });
  });
}

// Handles Symbol Cipher logic
function handleSymbolCipher() {
  process.stdout.write(colorText('Enter message: ', color.yellow));
  process.stdin.once('data', (messageInput) => {
    const message = messageInput.toString().trim();
    try {
      const result = symbolCipher(message);
      process.stdout.write(`\n${colorText('Result: ', color.green)}${colorText(result, color.cyan)}\n\n`);
    } catch (error) {
      process.stdout.write(colorText(`Error: ${error.message}\n`, color.red));
    }
    askTryAgain();
  });
}

// Handles Reverse Cipher logic
function handleReverseCipher() {
  process.stdout.write(colorText('Enter message: ', color.yellow));
  process.stdin.once('data', (messageInput) => {
    const message = messageInput.toString().trim();
    try {
      const result = reverseCipher(message);
      process.stdout.write(`\n${colorText('Result: ', color.green)}${colorText(result, color.cyan)}\n\n`);
    } catch (error) {
      process.stdout.write(colorText(`Error: ${error.message}\n`, color.red));
    }
    askTryAgain();
  });
}

// Handles Vigenère Cipher logic
function handleVigenereCipher() {
  process.stdout.write(colorText('Enter key for Vigenère cipher (letters only): ', color.yellow));
  process.stdin.once('data', (keyInput) => {
    const key = keyInput.toString().trim();
    
    if (!key.match(/^[a-zA-Z]+$/)) {
      process.stdout.write(colorText('Invalid key! Please use letters only.\n', color.red));
      handleVigenereCipher(); // Recursive retry
      return;
    }

    process.stdout.write(colorText('Enter message: ', color.yellow));
    process.stdin.once('data', (messageInput) => {
      const message = messageInput.toString().trim();
      try {
        const result = vigenereCipher(message, key);
        process.stdout.write(`\n${colorText('Result: ', color.green)}${colorText(result, color.cyan)}\n\n`);
      } catch (error) {
        process.stdout.write(colorText(`Error: ${error.message}\n`, color.red));
      }
      askTryAgain();
    });
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
    try {
      const result = isEncode ? encodeMessage(message) : decodeMessage(message);
      process.stdout.write(`\n${colorText('Result: ', color.green)}${colorText(result, color.cyan)}\n\n`);
    } catch (error) {
      process.stdout.write(colorText(`Error: ${error.message}\n`, color.red));
    }
    askTryAgain();
  });
}

// Handles Base64 encoding/decoding
function handleBase64() {
  process.stdout.write(colorText('Enter message to encode or decode in Base64: ', color.yellow));
  process.stdin.once('data', (messageInput) => {
    const message = messageInput.toString().trim();
    process.stdout.write(colorText('Would you like to (1) encode or (2) decode? ', color.yellow));
    process.stdin.once('data', (choiceInput) => {
      const choice = choiceInput.toString().trim();
      try {
        let result;
        if (choice === '1') {
          result = base64Encode(message);
          process.stdout.write(`\n${colorText('Base64 Encoded: ', color.green)}${colorText(result, color.cyan)}\n\n`);
        } else if (choice === '2') {
          result = base64Decode(message);
          process.stdout.write(`\n${colorText('Base64 Decoded: ', color.green)}${colorText(result, color.cyan)}\n\n`);
        } else {
          process.stdout.write(colorText('Invalid choice! Please choose 1 or 2.\n', color.red));
          handleBase64();  // Recursive retry
          return;
        }
      } catch (error) {
        process.stdout.write(colorText(`Error: ${error.message}\n`, color.red));
        handleBase64();  // Recursive retry
        return;
      }
      askTryAgain();
    });
  });
}

// Handles SHA256 hashing
function handleSHA256() {
  process.stdout.write(colorText('Enter message to hash with SHA256: ', color.yellow));
  process.stdin.once('data', (messageInput) => {
    const message = messageInput.toString().trim();
    try {
      const result = sha256Hash(message);
      process.stdout.write(`\n${colorText('SHA256 Hash: ', color.green)}${colorText(result, color.cyan)}\n\n`);
    } catch (error) {
      process.stdout.write(colorText(`Error: ${error.message}\n`, color.red));
    }
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
      case '3': handleReverseCipher(); break;
      case '4': handleVigenereCipher(); break;
      case '5': handleSuperCipher(true); break;
      case '6': handleSuperCipher(false); break;
      case '7': handleBase64(); break;
      case '8': handleSHA256(); break;
      case '9': process.exit(); break;
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