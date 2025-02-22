// Import the encryptors functions
const { caesarCipher, symbolCipher, reverseCipher } = require('./encryptors');

// Validate command line arguments
if (process.argv.length < 3 || !['encode', 'decode'].includes(process.argv[2])) {
  process.stdout.write('Usage: node super-encoder.js [encode|decode]\n');
  process.exit();
}

// Function to encode the message
const encodeMessage = (str) => {
  const caesarShift = 4; // Example shift for Caesar cipher
  let encoded = caesarCipher(str, caesarShift); // Apply Caesar cipher
  encoded = symbolCipher(encoded); // Apply Symbol cipher
  encoded = reverseCipher(encoded); // Apply Reverse cipher
  return encoded;
};

// Function to decode the message
const decodeMessage = (str) => {
  const caesarShift = 4; // Same shift as encoding
  let decoded = reverseCipher(str); // First, reverse the encoding
  decoded = symbolCipher(decoded); // Then, decode using Symbol cipher
  decoded = caesarCipher(decoded, -caesarShift); // Finally, reverse the Caesar cipher with a negative shift
  return decoded;
};

// User input / output logic
const handleInput = (userInput) => {
  const str = userInput.toString().trim();
  let output;

  if (process.argv[2] === 'encode') {
    output = encodeMessage(str);
  } else if (process.argv[2] === 'decode') {
    output = decodeMessage(str);
  }

  process.stdout.write(output + '\n');
  process.exit();
};

// Running the program
process.stdout.write('Enter the message you would like to encrypt...\n> ');
process.stdin.on('data', handleInput);