const crypto = require('crypto'); // Import the crypto module for SHA-256

// Caesar Cipher
const caesarCipher = (str, amount = 0) => {
  if (amount < 0) {
    return caesarCipher(str, amount + 26); // Handle negative shifts
  }
  let output = '';
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (char.match(/[a-z]/i)) { // Check if the character is a letter
      let code = str.charCodeAt(i);
      if (code >= 65 && code <= 90) { // Uppercase letters
        char = String.fromCharCode(((code - 65 + amount) % 26) + 65);
      } else if (code >= 97 && code <= 122) { // Lowercase letters
        char = String.fromCharCode(((code - 97 + amount) % 26) + 97);
      }
    }
    output += char; // Append the transformed character
  }
  return output;
};

// Symbol Cipher
const symbolCipher = (str) => {
  const symbols = {
    'i': '!', '!': 'i',
    'l': '1', '1': 'l',
    's': '$', '$': 's',
    'o': '0', '0': 'o',
    'a': '@', '@': 'a',
    'e': '3', '3': 'e',
    'b': '6', '6': 'b',
    'g': '9', '9': 'g',
    't': '+', '+': 't',
    'p': '%', '%': 'p',
    'c': '(', '(': 'c',
    'd': ')', ')': 'd',
    'f': '#', '#': 'f',
    'm': '~', '~': 'm',
    'n': '&', '&': 'n',
    'r': '^', '^': 'r',
    'u': '*', '*': 'u',
    'y': '€', '€': 'y',
    'z': '7', '7': 'z'
  };

  let output = '';
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    // Check both lowercase and uppercase mappings
    if (symbols[char.toLowerCase()]) {
      // Preserve the original case
      if (char === char.toUpperCase()) {
        output += symbols[char.toLowerCase()].toUpperCase();
      } else {
        output += symbols[char];
      }
    } else {
      output += char; // Keep the character as is if no mapping exists
    }
  }
  return output;
};

// Reverse Cipher
const reverseCipher = (sentence) => {
  let words = sentence.split(' ');
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].split('').reverse().join(''); // Reverse each word
  }
  return words.join(' '); // Join the reversed words back into a sentence
};

// Vigenère Cipher
const vigenereCipher = (str, key) => {
  if (!key || !key.match(/^[a-zA-Z]+$/)) {
    throw new Error('Invalid key! Key must contain only letters.');
  }
  let output = '';
  for (let i = 0, j = 0; i < str.length; i++) {
    let char = str[i];
    if (char.match(/[a-z]/i)) { // Check if the character is a letter
      let code = str.charCodeAt(i);
      let shift = key[j % key.length].toUpperCase().charCodeAt(0) - 65; // Get shift from key
      if (code >= 65 && code <= 90) { // Uppercase letters
        char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) { // Lowercase letters
        char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
      j++; // Move to the next character in the key
    }
    output += char; // Append the transformed character
  }
  return output;
};

// Base64 Encoding
const base64Encode = (str) => {
  if (!str) throw new Error('Input string is required for Base64 encoding.');
  return Buffer.from(str).toString('base64'); // Convert string to base64
};

// Base64 Decoding
const base64Decode = (str) => {
  if (!str) throw new Error('Input string is required for Base64 decoding.');
  try {
    return Buffer.from(str, 'base64').toString('utf-8'); // Convert base64 to string
  } catch (error) {
    throw new Error('Invalid Base64 input.');
  }
};

// SHA-256 Hashing
const sha256Hash = (str) => {
  if (!str) throw new Error('Input string is required for SHA-256 hashing.');
  return crypto.createHash('sha256').update(str).digest('hex'); // Hash the string using SHA-256
};

// Exporting the functions to be used in other files
module.exports = {
  caesarCipher,
  symbolCipher,
  reverseCipher,
  vigenereCipher,
  base64Encode,
  base64Decode,
  sha256Hash
};