const { caesarCipher, symbolCipher, reverseCipher, vigenereCipher, base64Encode, base64Decode, sha256Hash } = require('./encryptors');

// Validate command line arguments
const mode = process.argv[2];
if (!['encode', 'decode', 'hash'].includes(mode)) {
  process.stdout.write('Usage: node super-encoder.js [encode|decode|hash]\n');
  process.exit(1);
}

// Function to encode the message with a multi-step process
const encodeMessage = (str) => {
  let encoded = caesarCipher(str, { amount: 5 });
  encoded = symbolCipher(encoded);
  encoded = vigenereCipher(encoded, { key: 'key' });
  encoded = reverseCipher(encoded);
  return base64Encode(encoded);
};

// Function to decode the message by reversing the steps
const decodeMessage = (str) => {
  let decoded = base64Decode(str);
  decoded = reverseCipher(decoded);
  decoded = vigenereCipher(decoded, { key: 'key', decrypt: true });
  decoded = symbolCipher(decoded);
  return caesarCipher(decoded, { amount: -5 });
};

// Function to hash the message using SHA-256
const sha256EncodeMessage = (str) => sha256Hash(str);

// User input/output logic
const handleInput = (userInput) => {
  const str = userInput.toString().trim();
  try {
    let output;
    if (mode === 'encode') output = encodeMessage(str);
    else if (mode === 'decode') output = decodeMessage(str);
    else if (mode === 'hash') output = sha256EncodeMessage(str);
    process.stdout.write(`${output}\n`);
  } catch (error) {
    process.stdout.write(`Error: ${error.message}\n`);
  }
  process.exit();
};

// Running the program
process.stdout.write('Enter the message you would like to process...\n> ');
process.stdin.once('data', handleInput);