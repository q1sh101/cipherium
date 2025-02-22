// Encryptors.js - Contains encryption functions

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

// Exporting the functions to be used in other files
module.exports = {
  caesarCipher,
  symbolCipher,
  reverseCipher
};