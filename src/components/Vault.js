
import React, { useState } from 'react';
import FileUpload from './FileUpload';
import BiometricPrompt from './BiometricPrompt';
import '../styles/Vault.css';

export default function Vault() {
  const [files, setFiles] = useState([]);
  const [isLocked, setIsLocked] = useState(true);
  const [showBiometric, setShowBiometric] = useState(false);

  const handleUnlock = () => {
    setShowBiometric(true);
  };

  const handleBiometricSuccess = () => {
    setIsLocked(false);
    setShowBiometric(false);
  };

  const handleAddFile = (file) => {
    setFiles([...files, { 
      id: Date.now(), 
      name: file.name, 
      size: file.size,
      uploadedAt: new Date().toISOString()
    }]);
  };

  return (
    <div className="vault-container">
      <div className="vault-header">
        <h1>Oblivian Vault</h1>
        <div className="vault-status">
          <span className={`status-indicator ${isLocked ? 'locked' : 'unlocked'}`}>
            {isLocked ? '🔒' : '🔓'}
          </span>
          <span>{isLocked ? 'Locked' : 'Unlocked'}</span>
        </div>
      </div>
      
      {isLocked ? (
        <div className="unlock-section">
          <button className="unlock-btn" onClick={handleUnlock}>
            Unlock Vault
          </button>
        </div>
      ) : (
        <div className="vault-content">
          <FileUpload onFilesAdded={handleAddFile} />
          
          <div className="file-list">
            {files.map(file => (
              <div key={file.id} className="file-item">
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-meta">
                    {(file.size / 1024).toFixed(1)} KB • {new Date(file.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="file-actions">
                  <button className="action-btn download">⬇</button>
                  <button className="action-btn delete">🗑</button>
                </div>
              </div>
            ))}
            {files.length === 0 && (
              <div className="empty-state">
                <p>No files in your vault yet</p>
                <p>Upload files to get started</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <BiometricPrompt 
        isOpen={showBiometric} 
        onClose={() => setShowBiometric(false)}
        onSuccess={handleBiometricSuccess}
      />
    </div>
  );
}
