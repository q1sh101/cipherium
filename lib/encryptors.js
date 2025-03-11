const crypto = require('crypto'); // Import the crypto module for SHA-256
const Buffer = require('buffer').Buffer; // Import Buffer for Base64

// Caesar Cipher: Shifts letters by a specified amount
const caesarCipher = (str, { amount = 0 } = {}) => {
  if (typeof str !== 'string') throw new Error('Input must be a string.');
  if (!Number.isInteger(amount)) throw new Error('Shift amount must be an integer.');
  if (amount < 0) return caesarCipher(str, { amount: amount + 26 }); // Handle negative shifts
  let output = '';
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (char.match(/[a-z]/i)) {
      let code = str.charCodeAt(i);
      if (code >= 65 && code <= 90) { // Uppercase letters
        char = String.fromCharCode(((code - 65 + amount) % 26) + 65);
      } else if (code >= 97 && code <= 122) { // Lowercase letters
        char = String.fromCharCode(((code - 97 + amount) % 26) + 97);
      }
    }
    output += char;
  }
  return output;
};

// Symbol Cipher: Replaces specific letters with symbols and vice versa
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

// Reverse Cipher: Reverses each word in a sentence
const reverseCipher = (sentence) => {
  if (typeof sentence !== 'string') throw new Error('Input must be a string.');
  return sentence.split(' ').map(word => word.split('').reverse().join('')).join(' ');
};

// Vigenère Cipher: Polybius-style cipher with key-based shifts
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

// Base64 Encoding: Encodes string to Base64 format
const base64Encode = (str) => {
  if (typeof str !== 'string') throw new Error('Input must be a string.');
  if (!str) throw new Error('Input string cannot be empty for Base64 encoding.');
  return Buffer.from(str).toString('base64');
};

// Base64 Decoding: Decodes Base64 string to plaintext
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

// SHA-256 Hashing: Creates a SHA-256 hash of the input string
const sha256Hash = (str) => {
  if (typeof str !== 'string') throw new Error('Input must be a string.');
  if (!str) throw new Error('Input string cannot be empty for SHA-256 hashing.');
  return crypto.createHash('sha256').update(str, 'utf-8').digest('hex');
};

// StreamCipherX: Stream cipher with XOR and SHA256-expanded key
const streamCipherX = (str, { key } = {}) => {
  if (typeof str !== 'string') throw new Error('Input must be a string.');
  if (typeof key !== 'string' || !key) throw new Error('Key must be a non-empty string.');
  if (key.length < str.length) throw new Error('Key must be at least as long as the input string for secure stream cipher.');

  const expandedKey = crypto.createHash('sha256').update(key).digest('hex'); // Expand key with SHA256
  let output = '';
  for (let i = 0; i < str.length; i++) {
    const strCharCode = str.charCodeAt(i);
    const keyCharCode = expandedKey.charCodeAt(i % expandedKey.length); // Use expanded key
    const encryptedCharCode = strCharCode ^ keyCharCode; // XOR operation
    output += String.fromCharCode(encryptedCharCode);
  }
  return output; // Same function decodes with the same key due to XOR properties
};

// KeyStretchHash: Strengthens key with multiple SHA256 iterations and combines with message
const keyStretchHash = (str, { key } = {}) => {
  if (typeof str !== 'string') throw new Error('Input must be a string.');
  if (typeof key !== 'string' || !key) throw new Error('Key must be a non-empty string.');

  let stretchedKey = key;
  for (let i = 0; i < 5; i++) { // 5 iterations of SHA256 for key stretching
    stretchedKey = crypto.createHash('sha256').update(stretchedKey).digest('hex');
  }
  const combined = crypto.createHash('sha256').update(stretchedKey + str).digest('hex');
  return combined;
};

// MatrixMixer: 3x3 matrix-based cipher inspired by Hill Cipher
const matrixMixer = (str, { key } = {}) => {
  if (typeof str !== 'string') throw new Error('Input must be a string.');
  if (typeof key !== 'string' || key.length < 9) throw new Error('Key must be at least 9 characters for 3x3 matrix.');

  // Create a simple 3x3 matrix from key (first 9 chars)
  const matrix = [
    [key.charCodeAt(0) % 5 + 1, key.charCodeAt(1) % 5 + 1, key.charCodeAt(2) % 5 + 1],
    [key.charCodeAt(3) % 5 + 1, key.charCodeAt(4) % 5 + 1, key.charCodeAt(5) % 5 + 1],
    [key.charCodeAt(6) % 5 + 1, key.charCodeAt(7) % 5 + 1, key.charCodeAt(8) % 5 + 1]
  ];

  // Pad string to multiple of 3
  const paddedStr = str.padEnd(Math.ceil(str.length / 3) * 3, '\0');
  let output = '';

  for (let i = 0; i < paddedStr.length; i += 3) {
    const block = [
      paddedStr.charCodeAt(i) || 0,
      paddedStr.charCodeAt(i + 1) || 0,
      paddedStr.charCodeAt(i + 2) || 0
    ];
    // Matrix multiplication (simplified modulo 256 for char codes)
    const result = [
      (matrix[0][0] * block[0] + matrix[0][1] * block[1] + matrix[0][2] * block[2]) % 256,
      (matrix[1][0] * block[0] + matrix[1][1] * block[1] + matrix[1][2] * block[2]) % 256,
      (matrix[2][0] * block[0] + matrix[2][1] * block[1] + matrix[2][2] * block[2]) % 256
    ];
    output += String.fromCharCode(...result);
  }
  return output;
};

// DoubleHashChain: Double SHA256 hashing with key for blockchain-like integrity
const doubleHashChain = (str, { key } = {}) => {
  if (typeof str !== 'string') throw new Error('Input must be a string.');
  if (typeof key !== 'string' || !key) throw new Error('Key must be a non-empty string.');

  const firstHash = crypto.createHash('sha256').update(key + str).digest('hex');
  const secondHash = crypto.createHash('sha256').update(firstHash + key).digest('hex');
  return secondHash;
};

// Exporting all functions to be used in other files
module.exports = {
  caesarCipher,
  symbolCipher,
  reverseCipher,
  vigenereCipher,
  base64Encode,
  base64Decode,
  sha256Hash,
  streamCipherX,
  keyStretchHash,
  matrixMixer,
  doubleHashChain
};