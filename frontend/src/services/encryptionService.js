
// AES Encryption Service
export class EncryptionService {
  static async generateKey() {
    return await window.crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  static async encryptData(data, key) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);
    
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encodedData
    );

    return {
      encryptedData: new Uint8Array(encryptedData),
      iv: iv
    };
  }

  static async decryptData(encryptedData, key, iv) {
    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      encryptedData
    );

    return new TextDecoder().decode(decryptedData);
  }

  // Create consistent key from string
  static async createKeyFromString(keyString) {
    // Normalize the key string and ensure it's exactly 32 bytes
    const normalizedKey = keyString.trim();
    const keyData = new TextEncoder().encode(normalizedKey.padEnd(32, '0').slice(0, 32));
    
    return await window.crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );
  }

  static async encryptFile(file, keyString) {
    try {
      console.log('Encryption - Starting with key:', keyString);
      console.log('Encryption - File size:', file.size);

      // Create crypto key from string
      const cryptoKey = await this.createKeyFromString(keyString);

      // Generate random IV
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      console.log('Encryption - Generated IV:', Array.from(iv));

      // Read file as array buffer
      const fileBuffer = await file.arrayBuffer();
      console.log('Encryption - File buffer size:', fileBuffer.byteLength);
      
      // Encrypt the file data
      const encryptedData = await window.crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        cryptoKey,
        fileBuffer
      );

      console.log('Encryption - Encrypted data size:', encryptedData.byteLength);

      // Combine IV and encrypted data
      const combined = new Uint8Array(iv.length + encryptedData.byteLength);
      combined.set(iv, 0);
      combined.set(new Uint8Array(encryptedData), iv.length);

      console.log('Encryption - Combined data size:', combined.length);
      console.log('Encryption - First 20 bytes:', Array.from(combined.slice(0, 20)));

      return combined;
    } catch (error) {
      console.error('EncryptionService encryption error:', error);
      throw error;
    }
  }

  static async decryptFile(encryptedBuffer, keyString) {
    try {
      console.log('Decryption - Starting with key:', keyString);
      console.log('Decryption - Input type:', encryptedBuffer.constructor.name);
      console.log('Decryption - Buffer length:', encryptedBuffer.byteLength || encryptedBuffer.length);

      // Convert ArrayBuffer to Uint8Array if needed
      let encryptedData;
      if (encryptedBuffer instanceof ArrayBuffer) {
        encryptedData = new Uint8Array(encryptedBuffer);
      } else if (encryptedBuffer instanceof Uint8Array) {
        encryptedData = encryptedBuffer;
      } else {
        throw new Error('Invalid input type - expected ArrayBuffer or Uint8Array');
      }

      console.log('Decryption - Encrypted data length:', encryptedData.length);
      console.log('Decryption - First 20 bytes:', Array.from(encryptedData.slice(0, Math.min(20, encryptedData.length))));

      // Validate input size (12 bytes IV + at least 16 bytes for GCM auth tag + 1 byte data)
      if (!encryptedData || encryptedData.length < 29) {
        throw new Error('Invalid encrypted data - file may be corrupted or too small (minimum 29 bytes required)');
      }

      // Create crypto key from string (same method as encryption)
      const cryptoKey = await this.createKeyFromString(keyString);

      // Extract IV (first 12 bytes) and encrypted payload (remaining bytes)
      const iv = encryptedData.slice(0, 12);
      const encryptedPayload = encryptedData.slice(12);

      console.log('Decryption - IV length:', iv.length);
      console.log('Decryption - IV bytes:', Array.from(iv));
      console.log('Decryption - Encrypted payload length:', encryptedPayload.length);

      if (iv.length !== 12) {
        throw new Error('Invalid IV length - file may be corrupted');
      }

      if (encryptedPayload.length < 17) { // At least 16 bytes for GCM auth tag + 1 byte data
        throw new Error('Invalid encrypted payload - file may be corrupted');
      }

      // Decrypt the data using AES-GCM
      const decryptedData = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv,
        },
        cryptoKey,
        encryptedPayload
      );

      console.log('Decryption successful - output length:', decryptedData.byteLength);
      
      if (decryptedData.byteLength === 0) {
        throw new Error('Decryption resulted in empty data - key may be incorrect');
      }

      return decryptedData;

    } catch (error) {
      console.error('EncryptionService decryption error:', error);
      
      // Provide more specific error messages
      if (error.name === 'OperationError') {
        throw new Error('Decryption failed - incorrect key or corrupted file');
      } else if (error.message.includes('Invalid') || error.message.includes('corrupted')) {
        throw error; // Re-throw our custom validation errors
      } else {
        throw new Error(`Decryption error: ${error.message}`);
      }
    }
  }
}
