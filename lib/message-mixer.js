const { caesarCipher, symbolCipher, reverseCipher, vigenereCipher, base64Encode, sha256Hash } = require('./encryptors');

// Helper function for determining the encryption method based on CLI argument
function getEncryptionMethod() {
  const encryptionType = process.argv[2];
  let encryptionMethod;

  switch (encryptionType) {
    case 'symbol':
      encryptionMethod = symbolCipher;
      break;
    case 'reverse':
      encryptionMethod = reverseCipher;
      break;
    case 'caesar':
      const amount = Number(process.argv[3]);
      if (isNaN(amount) || !Number.isInteger(amount)) {
        process.stdout.write('Error: Caesar cipher requires a valid integer shift amount.\n');
        process.exit(1);
      }
      encryptionMethod = (str) => caesarCipher(str, { amount });
      break;
    case 'vigenere':
      const key = process.argv[3];
      if (!key || !key.match(/^[a-zA-Z]+$/)) {
        process.stdout.write('Error: Vigenère cipher requires a valid key (letters only).\n');
        process.exit(1);
      }
      encryptionMethod = (str) => vigenereCipher(str, { key });
      break;
    case 'base64':
      encryptionMethod = base64Encode;
      break;
    case 'sha256':
      encryptionMethod = sha256Hash;
      break;
    default:
      process.stdout.write('Error: Invalid encryption type. Use: symbol, reverse, caesar, vigenere, base64, or sha256.\n');
      process.exit(1);
  }

  return encryptionMethod;
}

// Helper function to display the encrypted message
function displayEncryptedMessage(encryptionMethod, userInput) {
  try {
    const output = encryptionMethod(userInput);
    process.stdout.write(`\nHere is your encrypted message:\n> ${output}\n`);
  } catch (error) {
    process.stdout.write(`Error: ${error.message}\n`);
  }
  process.exit();
}

// Running the program and listening for input
const encryptionMethod = getEncryptionMethod();
process.stdout.write('Enter the message you would like to encrypt...\n> ');
process.stdin.once('data', (userInput) => displayEncryptedMessage(encryptionMethod, userInput.toString().trim()));