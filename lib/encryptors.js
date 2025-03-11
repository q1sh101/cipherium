const crypto = require('crypto'); // Import the crypto module for SHA-256
const Buffer = require('buffer').Buffer; // Import Buffer for Base64

// Caesar Cipher
const caesarCipher = (str, { amount = 0 } = {}) => {
  if (typeof str !== 'string') throw new Error('Input must be a string.');
  if (!Number.isInteger(amount)) throw new Error('Shift amount must be an integer.');
  if (amount < 0) return caesarCipher(str, { amount: amount + 26 }); // Handle negative shifts
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
  if (typeof str !== 'string') throw new Error('Input must be a string.');
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
    if (symbols[char.toLowerCase()]) {
      output += char === char.toUpperCase() ? symbols[char.toLowerCase()].toUpperCase() : symbols[char];
    } else {
      output += char;
    }
  }
  return output;
};

// Reverse Cipher
const reverseCipher = (sentence) => {
  if (typeof sentence !== 'string') throw new Error('Input must be a string.');
  return sentence.split(' ').map(word => word.split('').reverse().join('')).join(' ');
};

// Vigenère Cipher
const vigenereCipher = (str, { key, decrypt = false } = {}) => {
  if (typeof str !== 'string') throw new Error('Input must be a string.');
  if (!key || !key.match(/^[a-zA-Z]+$/)) throw new Error('Key must contain only letters and cannot be empty.');
  let output = '';
  for (let i = 0, j = 0; i < str.length; i++) {
    let char = str[i];
    if (char.match(/[a-z]/i)) {
      let code = str.charCodeAt(i);
      let shift = key[j % key.length].toUpperCase().charCodeAt(0) - 65;
      if (decrypt) shift = 26 - shift;
      if (code >= 65 && code <= 90) {
        char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
      } else if (code >= 97 && code <= 122) {
        char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
      }
      j++;
    }
    output += char;
  }
  return output;
};

// Base64 Encoding
const base64Encode = (str) => {
  if (typeof str !== 'string') throw new Error('Input must be a string.');
  if (!str) throw new Error('Input string cannot be empty for Base64 encoding.');
  return Buffer.from(str).toString('base64');
};

// Base64 Decoding
const base64Decode = (str) => {
  if (typeof str !== 'string') throw new Error('Input must be a string.');
  if (!str) throw new Error('Input string cannot be empty for Base64 decoding.');
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(str)) throw new Error('Invalid Base64 format: use only A-Z, a-z, 0-9, +, /, and =.');
  try {
    return Buffer.from(str, 'base64').toString('utf-8');
  } catch (error) {
    throw new Error('Invalid Base64 input: decoding failed due to incorrect data.');
  }
};

// SHA-256 Hashing
const sha256Hash = (str) => {
  if (typeof str !== 'string') throw new Error('Input must be a string.');
  if (!str) throw new Error('Input string cannot be empty for SHA-256 hashing.');
  return crypto.createHash('sha256').update(str, 'utf-8').digest('hex');
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