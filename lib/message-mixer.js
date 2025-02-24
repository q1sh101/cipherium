const { caesarCipher, symbolCipher, reverseCipher, vigenereCipher, base64Encode, sha256Hash } = require('./lib/encryptors');

// Helper function for determining the encryption method
function getEncryptionMethod() {
  let encryptionMethod;

  const encryptionType = process.argv[2]; // Get the encryption type from command line
  if (encryptionType === 'symbol') {
    encryptionMethod = symbolCipher;
  } else if (encryptionType === 'reverse') {
    encryptionMethod = reverseCipher;
  } else if (encryptionType === 'caesar') {
    let amount = Number(process.argv[3]);
    if (Number.isNaN(amount) || !Number.isInteger(amount)) { // Validate the shift amount
      process.stdout.write(`Please provide a valid integer for the Caesar shift.\n`);
      process.exit();
    }
    encryptionMethod = (str) => caesarCipher(str, amount);
  } else if (encryptionType === 'vigenere') {
    const key = process.argv[3];
    if (!key || !key.match(/^[a-zA-Z]+$/)) { // Validate the key
      process.stdout.write(`Please provide a valid key (letters only) for the Vigenère cipher.\n`);
      process.exit();
    }
    encryptionMethod = (str) => vigenereCipher(str, key);
  } else if (encryptionType === 'base64') {
    encryptionMethod = base64Encode;
  } else if (encryptionType === 'sha256') {
    encryptionMethod = sha256Hash;
  } else {
    process.stdout.write(`Please provide a valid encryption type: symbol, reverse, caesar, vigenere, base64, or sha256.\n`);
    process.exit();
  }

  process.stdout.write('Enter the message you would like to encrypt...\n> ');
  return encryptionMethod;
}

// Helper function to display the encrypted message
function displayEncryptedMessage(encryptionMethod, userInput) {
  let str = userInput.toString().trim();
  try {
    let output = encryptionMethod(str);
    process.stdout.write(`\nHere is your encrypted message:\n> ${output}\n`);
  } catch (error) {
    process.stdout.write(`\nError: ${error.message}\n`);
  }
  process.exit();
}

// Running the program and listening for input
const encryptionMethod = getEncryptionMethod();
process.stdin.on('data', (userInput) => {
  displayEncryptedMessage(encryptionMethod, userInput);
});