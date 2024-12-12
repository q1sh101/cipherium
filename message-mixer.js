// Import encryption functions from encryptors.js
const { caesarCipher, symbolCipher, reverseCipher } = require('./encryptors');

// User Input / Output Logic

// Helper function for determining the encryption method
function getEncryptionMethod() {
  let encryptionMethod;
  
  const encryptionType = process.argv[2];  
  if (encryptionType === 'symbol') {
    encryptionMethod = symbolCipher;
  } else if (encryptionType === 'reverse') {
    encryptionMethod = reverseCipher;
  } else if (encryptionType === 'caesar') {
    let amount = Number(process.argv[3]);
    if (Number.isNaN(amount)) {
      process.stdout.write(`Try again with a valid amount argument. \n`)
      process.exit();  
    }
    encryptionMethod = (str) => caesarCipher(str, amount);
  } else {
    process.stdout.write(`Try again with a valid encryption type. \n`)
    process.exit();
  }

  process.stdout.write('Enter the message you would like to encrypt...\n> ');
  return encryptionMethod;
}

// Helper function to display the encrypted message
function displayEncryptedMessage(encryptionMethod, userInput) {
  let str = userInput.toString().trim();    
  let output = encryptionMethod(str);
  process.stdout.write(`\nHere is your encrypted message:\n> ${output}\n`)
  process.exit();
}

// Running the program and listening for input
const encryptionMethod = getEncryptionMethod();
process.stdin.on('data', (userInput) => {
  displayEncryptedMessage(encryptionMethod, userInput);
});
