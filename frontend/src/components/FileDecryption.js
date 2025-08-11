import React, { useState, useRef } from 'react';
import { EncryptionService } from '../services/encryptionService';
import '../styles/FileDecryption.css';

function FileDecryption() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [decryptionKey, setDecryptionKey] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDecrypt = async () => {
    if (!selectedFile || !decryptionKey.trim()) {
      alert('Please select a file and enter the decryption key');
      return;
    }

    setIsDecrypting(true);
    try {
      console.log('Starting decryption process...');
      console.log('File size:', selectedFile.size);
      console.log('Key:', decryptionKey.trim());

      // Validate file size (IV is 12 bytes + at least 1 byte of encrypted data + 16 bytes auth tag)
      if (selectedFile.size < 29) {
        throw new Error('File is too small to be a valid encrypted file (minimum 29 bytes required)');
      }

      // Read the encrypted file as ArrayBuffer
      const encryptedBuffer = await selectedFile.arrayBuffer();
      console.log('Read encrypted buffer, size:', encryptedBuffer.byteLength);

      // Decrypt the file using the encryption service
      const decryptedBuffer = await EncryptionService.decryptFile(
        encryptedBuffer,
        decryptionKey.trim()
      );

      console.log('Decryption successful, buffer length:', decryptedBuffer.byteLength);

      // Validate decrypted data
      if (decryptedBuffer.byteLength === 0) {
        throw new Error('Decrypted file is empty - this may indicate an incorrect key or corrupted file');
      }

      // Determine original file name
      let originalFileName = selectedFile.name;
      if (originalFileName.endsWith('.encrypted')) {
        originalFileName = originalFileName.slice(0, -10); // Remove .encrypted
      } else if (originalFileName.endsWith('.enc')) {
        originalFileName = originalFileName.slice(0, -4); // Remove .enc
      } else {
        // If no known encrypted extension, add "decrypted_" prefix
        originalFileName = 'decrypted_' + originalFileName;
      }

      // Create blob from decrypted data
      const decryptedBlob = new Blob([decryptedBuffer]);

      // Trigger download
      const url = URL.createObjectURL(decryptedBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = originalFileName;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`File decrypted and downloaded successfully as: ${originalFileName}`);
      
      // Reset form
      setSelectedFile(null);
      setDecryptionKey('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Decryption error:', error);

      let errorMessage = 'Decryption failed. ';
      if (error.message.includes('OperationError') || error.message.includes('decrypt')) {
        errorMessage += 'Please verify your decryption key is correct.';
      } else if (error.message.includes('Invalid') || error.message.includes('corrupted')) {
        errorMessage += error.message;
      } else if (error.message.includes('too small')) {
        errorMessage += error.message;
      } else {
        errorMessage += `Error: ${error.message}`;
      }

      alert(errorMessage);
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <div className="file-decryption-container">
      <h3>🔓 Decrypt File</h3>
      <p>Upload an encrypted file and provide the decryption key to recover the original file.</p>

      <div
        className={`file-drop-zone ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {selectedFile ? (
          <div className="selected-file">
            <span className="file-icon">📄</span>
            <div className="file-details">
              <p className="file-name">{selectedFile.name}</p>
              <p className="file-size">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
        ) : (
          <div className="drop-placeholder">
            <span className="upload-icon">📁</span>
            <p>Drop encrypted file here or click to select</p>
          </div>
        )}
      </div>

      <div className="decryption-controls">
        <div className="key-input-group">
          <label htmlFor="decryption-key">Decryption Key:</label>
          <input
            id="decryption-key"
            type="password"
            value={decryptionKey}
            onChange={(e) => setDecryptionKey(e.target.value)}
            placeholder="Enter your decryption key"
            className="key-input"
          />
        </div>

        <button
          onClick={handleDecrypt}
          disabled={!selectedFile || !decryptionKey.trim() || isDecrypting}
          className="decrypt-btn"
        >
          {isDecrypting ? 'Decrypting...' : 'Decrypt File'}
        </button>
      </div>

      <div className="decryption-info">
        <h4>ℹ️ How it works:</h4>
        <ul>
          <li>Select an encrypted file from your computer</li>
          <li>Enter the same key that was used to encrypt the file</li>
          <li>Click "Decrypt File" to download the original file</li>
          <li>The decrypted file will be automatically downloaded</li>
        </ul>
      </div>
    </div>
  );
}

export default FileDecryption;