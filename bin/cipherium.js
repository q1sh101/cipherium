#!/usr/bin/env node

// Importing all cipher functions from encryptors.js
const { 
  caesarCipher, symbolCipher, reverseCipher, vigenereCipher, 
  base64Encode, base64Decode, sha256Hash, 
  streamCipherX, keyStretchHash, matrixMixer, doubleHashChain 
} = require('../lib/encryptors');

// ANSI color codes for cyberpunk/matrix aesthetic
const color = {
  reset: '\x1b[0m',     // Reset styles
  neonGreen: '\x1b[92m', // Bright neon green (Matrix vibe)
  neonPink: '\x1b[95m',  // Bright neon pink (Cyberpunk)
  neonBlue: '\x1b[96m',  // Bright neon blue (Techy)
  darkRed: '\x1b[31m',   // Dark red for errors/exit
  gray: '\x1b[90m',      // Subtle gray for secondary text
  bold: '\x1b[1m',       // Bold text
  underline: '\x1b[4m'   // Underline text
};

// Applies color and style to text
function colorText(text, colorCode, bold = false, underline = false) {
  const boldCode = bold ? color.bold : '';
  const underlineCode = underline ? color.underline : '';
  return `${boldCode}${underlineCode}${colorCode}${text}${color.reset}`;
}

// Simple delay function for animations
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Typing animation for cyberpunk effect
async function typeText(text, speed = 30) {
  for (let char of text) {
    process.stdout.write(char);
    await delay(speed);
  }
  process.stdout.write('\n');
}

// Enhanced, eye-catching ANSI art for "Cipherium"
async function displayCipheriumArt() {
  const art = [
    colorText('   ┌──┬────┬──┬────┬──┬────┬──┐', color.neonGreen),
    colorText('   ░▒▓█  C I P H E R I U M  █▓▒░', color.neonPink, true),
    colorText('   └──┴────┴──┴────┴──┴────┴──┘', color.neonGreen),
    colorText('  ├─[ 0101 ]─[ 1010 ]─[ 1111 ]─┤', color.neonBlue),
    colorText('   >>> Access Granted...', color.neonGreen)
  ];
  for (let line of art) {
    await typeText(line, 15);
  }
}

// Displays the refined, minimalistic main menu with clear encode/decode labels
async function displayMenu() {
  process.stdout.write('\x1Bc'); // Clear terminal for fresh look
  await displayCipheriumArt();
  await delay(0);
  const menu = `
${colorText('  ┌───────────────────────────────────────┐', color.neonGreen, true)}
${colorText('  │ Protocols:                            │', color.neonGreen, true)}
${colorText('  ├───────────────────────────────────────┤', color.neonGreen)}
${colorText('  │ 01 Caesar                             │', color.neonBlue)}
${colorText('  │ 02 Symbol                             │', color.neonBlue)}
${colorText('  │ 03 Reverse                            │', color.neonBlue)}
${colorText('  │ 04 Vigenère +Encode                   │', color.neonBlue)}
${colorText('  │ 05 Vigenère -Decode                   │', color.neonBlue)}
${colorText('  │ 06 Super  Encode                      │', color.neonBlue)}
${colorText('  │ 07 Super -Decode                      │', color.neonBlue)}
${colorText('  │ 08 Base64  Encode                     │', color.neonBlue)}
${colorText('  │ 09 Base64 -Decode                     │', color.neonBlue)}
${colorText('  │ 10 SHA256                             │', color.neonBlue)}
${colorText('  │ 11 StreamCipherX  Encode / -Decode    │', color.neonBlue)}
${colorText('  │ 12 KeyStretchHash                     │', color.neonBlue)}
${colorText('  │ 13 MatrixMixer                        │', color.neonBlue)}
${colorText('  │ 14 DoubleHashChain                    │', color.neonBlue)}
${colorText('  │ 15 Exit                               │', color.darkRed, true)}
${colorText('  └───────────────────────────────────────┘', color.neonGreen, true)}
${colorText('>>> Select protocol (01-15): ', color.neonGreen, false, true)}`;
  
  process.stdout.write(menu);
}

// Unified input handler with clear prompt
function getInput(prompt, callback) {
  process.stdout.write(colorText(`>>> ${prompt}`, color.neonGreen));
  process.stdin.once('data', (input) => {
    callback(input.toString().trim());
  });
}

// Retry/exit logic with refined text
function askTryAgain() {
  getInput('Restart protocol? (y/n): ', (answer) => {
    const response = answer.toLowerCase();
    if (['yes', 'y'].includes(response)) {
      displayMenu().then(listenForMenuInput);
    } else if (['no', 'n'].includes(response)) {
      process.stdout.write(colorText('>>> Shutting down system...\n', color.darkRed, true));
      process.exit();
    } else {
      process.stdout.write(colorText('>>> Error: Enter "y" or "n" only.\n', color.darkRed));
      askTryAgain();
    }
  });
}

// Executes cipher with clear output
function executeCipher(cipherFn, message, params = {}) {
  try {
    const result = cipherFn(message, params);
    process.stdout.write(colorText(`>>> Processed data: ${result}\n`, color.neonPink, true));
    askTryAgain();
  } catch (error) {
    process.stdout.write(colorText(`>>> Error detected: ${error.message}\n`, color.darkRed));
    askTryAgain();
  }
}

// Handler for Caesar Cipher
function handleCaesarCipher() {
  getInput('Enter shift number: ', (amount) => {
    const shift = parseInt(amount, 10);
    if (isNaN(shift)) {
      process.stdout.write(colorText('>>> Error: Shift must be a number.\n', color.darkRed));
      return handleCaesarCipher();
    }
    getInput('Enter your message: ', (message) => executeCipher(caesarCipher, message, { amount: shift }));
  });
}

// Handler for Symbol Cipher
function handleSymbolCipher() {
  getInput('Enter your message: ', (message) => executeCipher(symbolCipher, message));
}

// Handler for Reverse Cipher
function handleReverseCipher() {
  getInput('Enter your message: ', (message) => executeCipher(reverseCipher, message));
}

// Handler for Vigenère Cipher (encode or decode)
function handleVigenereCipher(isDecode) {
  getInput('Enter key (letters only): ', (key) => {
    if (!key.match(/^[a-zA-Z]+$/)) {
      process.stdout.write(colorText('>>> Error: Key must be letters only.\n', color.darkRed));
      return handleVigenereCipher(isDecode);
    }
    getInput('Enter your message: ', (message) => executeCipher(vigenereCipher, message, { key, decrypt: isDecode }));
  });
}

// Handler for Super Encoder (encode or decode)
function handleSuperCipher(isEncode) {
  const fn = isEncode 
    ? (str) => reverseCipher(symbolCipher(caesarCipher(str, 5))) 
    : (str) => caesarCipher(symbolCipher(reverseCipher(str)), -5);
  getInput(`Enter message to ${isEncode ? 'encode' : 'decode'}: `, (message) => executeCipher(fn, message));
}

// Handler for Base64 (encode or decode)
function handleBase64(isEncode) {
  const fn = isEncode ? base64Encode : base64Decode;
  getInput(`Enter message to ${isEncode ? 'encode' : 'decode'}: `, (message) => executeCipher(fn, message));
}

// Handler for SHA256 Hash
function handleSHA256() {
  getInput('Enter message to hash: ', (message) => executeCipher(sha256Hash, message));
}

// Handler for StreamCipherX
function handleStreamCipherX() {
  getInput('Enter key (same length as message or longer): ', (key) => {
    getInput('Enter your message: ', (message) => {
      if (key.length < message.length) {
        process.stdout.write(colorText('>>> Error: Key must be as long as message or longer.\n', color.darkRed));
        return handleStreamCipherX();
      }
      executeCipher(streamCipherX, message, { key });
    });
  });
}

// Handler for KeyStretchHash
function handleKeyStretchHash() {
  getInput('Enter key: ', (key) => {
    getInput('Enter your message: ', (message) => executeCipher(keyStretchHash, message, { key }));
  });
}

// Handler for MatrixMixer
function handleMatrixMixer() {
  getInput('Enter key (minimum 9 characters): ', (key) => {
    if (key.length < 9) {
      process.stdout.write(colorText('>>> Error: Key must be 9 characters or more.\n', color.darkRed));
      return handleMatrixMixer();
    }
    getInput('Enter your message: ', (message) => executeCipher(matrixMixer, message, { key }));
  });
}

// Handler for DoubleHashChain
function handleDoubleHashChain() {
  getInput('Enter key: ', (key) => {
    getInput('Enter your message: ', (message) => executeCipher(doubleHashChain, message, { key }));
  });
}

// Listens for menu input and routes to handlers
async function listenForMenuInput() {
  process.stdin.once('data', async (choiceInput) => {
    const choice = choiceInput.toString().trim();
    switch (choice) {
      case '01': case '1': handleCaesarCipher(); break;
      case '02': case '2': handleSymbolCipher(); break;
      case '03': case '3': handleReverseCipher(); break;
      case '04': case '4': handleVigenereCipher(false); break;
      case '05': case '5': handleVigenereCipher(true); break;
      case '06': case '6': handleSuperCipher(true); break;
      case '07': case '7': handleSuperCipher(false); break;
      case '08': case '8': handleBase64(true); break;
      case '09': case '9': handleBase64(false); break;
      case '10': handleSHA256(); break;
      case '11': handleStreamCipherX(); break;
      case '12': handleKeyStretchHash(); break;
      case '13': handleMatrixMixer(); break;
      case '14': handleDoubleHashChain(); break;
      case '15': 
        process.stdout.write(colorText('>>> Shutting down system GOODBYE...!\n', color.darkRed, true));
        process.exit(); 
        break;
      default:
        process.stdout.write(colorText('>>> Error: Invalid protocol. Choose 01-15.\n', color.darkRed));
        await displayMenu();
        listenForMenuInput();
    }
  });
}

// Starts the program with async menu display
async function main() {
  await displayMenu();
  listenForMenuInput();
}

main();