const { caesarCipher, symbolCipher, reverseCipher, vigenereCipher, base64Encode, base64Decode, sha256Hash } = require('./encryptors');

// Validate command line arguments
if (process.argv.length < 3 || !['encode', 'decode', 'hash'].includes(process.argv[2])) {
  process.stdout.write('Usage: node super-encoder.js [encode|decode|hash]\n');
  process.exit();
}

// Function to encode the message
const encodeMessage = (str) => {
  const caesarShift = 4; // Example shift for Caesar cipher
  const vigenereKey = 'key'; // Example key for Vigenère cipher
  let encoded = caesarCipher(str, caesarShift); // Apply Caesar cipher
  encoded = symbolCipher(encoded); // Apply Symbol cipher
  encoded = vigenereCipher(encoded, vigenereKey); // Apply Vigenère cipher
  encoded = reverseCipher(encoded); // Apply Reverse cipher
  encoded = base64Encode(encoded); // Apply Base64 encoding
  return encoded;
};

// Function to decode the message
const decodeMessage = (str) => {
  const caesarShift = 4; // Same shift as encoding
  const vigenereKey = 'key'; // Same key as encoding
  let decoded = base64Decode(str); // First, decode Base64
  decoded = reverseCipher(decoded); // Then, reverse the encoding
  decoded = vigenereCipher(decoded, vigenereKey, true); // Then, decode using Vigenère cipher
  decoded = symbolCipher(decoded); // Then, decode using Symbol cipher
  decoded = caesarCipher(decoded, -caesarShift); // Finally, reverse the Caesar cipher with a negative shift
  return decoded;
};

// Function to hash the message using SHA-256
const sha256EncodeMessage = (str) => {
  return sha256Hash(str);
};

// User input / output logic
const handleInput = (userInput) => {
  const str = userInput.toString().trim();
  let output;
  try {
    if (process.argv[2] === 'encode') {
      output = encodeMessage(str);
    } else if (process.argv[2] === 'decode') {
      output = decodeMessage(str);
    } else if (process.argv[2] === 'hash') {
      output = sha256EncodeMessage(str);
    }
    process.stdout.write(output + '\n');
  } catch (error) {
    process.stdout.write(`Error: ${error.message}\n`);
  }
  process.exit();
};

// Running the program
process.stdout.write('Enter the message you would like to encrypt...\n> ');
process.stdin.on('data', handleInput);