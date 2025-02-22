# Message Encryptor

Message Encryptor is a Node.js application that performs encryption and decryption of messages using different methods. The application includes three encryption methods: Caesar Cipher, Symbol Cipher, and Reverse Cipher.

### Encryption Methods

- **Caesar Cipher**: A rotational cipher that shifts the letters of the alphabet by a specified amount.
- **Symbol Cipher**: Replaces certain letters with symbols (e.g., `i` becomes `!`, `s` becomes `$`).
- **Reverse Cipher**: Reverses the order of letters or words in a message.

### Installation

To run this project locally, follow the steps below:

1. Clone the repository:
    ```bash
    git clone https://github.com/q1sh101/message-encryptor.git
    cd message-encryptor
    ```

### How to Use

You can use the following commands to encrypt and decrypt messages:

#### Encrypting a Message

- **Caesar Cipher**:  
    Shifts the letters of the alphabet by a specified value.  
    Run the command:
    ```bash
    node message-mixer.js caesar <shift_value>
    ```
    Example
    ```bash
    node message-mixer.js caesar 5
    ```

- **Symbol Cipher**:  
    Replaces letters with symbols.  
    Run the command:
    ```bash
    node message-mixer.js symbol
    ```

- **Reverse Cipher**:  
    Reverses the order of letters or words.  
    Run the command:
    ```bash
    node message-mixer.js reverse
    ```

When prompted, enter the message you want to encrypt.

#### Decrypting a Message

To decrypt a message, use the same methods but with reversed operations:

- **Caesar Cipher**:  
    Run the command:
    ```bash
    node message-mixer.js caesar -<shift_value>
    ```
    Example
    ```bash
    node message-mixer.js caesar -5
    ```

- **Symbol Cipher**:  
    Simply run the symbol cipher command again for decoding:
    ```bash
    node message-mixer.js symbol
    ```

- **Reverse Cipher**:  
    Reverse the process by running the reverse cipher again:
    ```bash
    node message-mixer.js reverse
    ```

### Example for Encrypting:
```bash
Example
> node message-mixer.js caesar 5

Enter the message you would like to encrypt...
> hello world

Here is your encrypted message:
> mjqqt btwqi
