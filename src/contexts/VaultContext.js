
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const VaultContext = createContext();

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};

export const VaultProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [files, setFiles] = useState([]);
  const [isLocked, setIsLocked] = useState(true);
  const [vaultSettings, setVaultSettings] = useState({
    biometricAuth: true,
    autoLock: true,
    lockTimeout: 5,
    encryptionLevel: 'AES-256',
    decoyVault: true
  });

  const loadVaultData = useCallback(async () => {
    try {
      const savedFiles = localStorage.getItem(`vault_files_${user?.id}`);
      const savedSettings = localStorage.getItem(`vault_settings_${user?.id}`);
      
      if (savedFiles) {
        setFiles(JSON.parse(savedFiles));
      }
      
      if (savedSettings) {
        setVaultSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Failed to load vault data:', error);
    }
  }, [user?.id]);

  const saveVaultData = useCallback(() => {
    if (user) {
      localStorage.setItem(`vault_files_${user.id}`, JSON.stringify(files));
      localStorage.setItem(`vault_settings_${user.id}`, JSON.stringify(vaultSettings));
    }
  }, [user, files, vaultSettings]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadVaultData();
    } else {
      setFiles([]);
      setIsLocked(true);
    }
  }, [isAuthenticated, user, loadVaultData]);

  useEffect(() => {
    if (isAuthenticated && user) {
      saveVaultData();
    }
  }, [files, vaultSettings, isAuthenticated, user, saveVaultData]);

  const unlockVault = async (method = 'biometric') => {
    try {
      if (method === 'biometric') {
        // Simulate biometric verification
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setIsLocked(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const lockVault = () => {
    setIsLocked(true);
  };

  const addFile = async (file, encryptedData) => {
    try {
      const newFile = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type,
        encryptedData: encryptedData || file,
        uploadedAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString()
      };
      
      setFiles(prev => [...prev, newFile]);
      return { success: true, file: newFile };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const removeFile = async (fileId) => {
    try {
      setFiles(prev => prev.filter(f => f.id !== fileId));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const downloadFile = async (fileId) => {
    try {
      const file = files.find(f => f.id === fileId);
      if (!file) {
        throw new Error('File not found');
      }
      
      // Update last accessed
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, lastAccessed: new Date().toISOString() }
          : f
      ));
      
      return { success: true, file };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateSettings = (newSettings) => {
    setVaultSettings(prev => ({ ...prev, ...newSettings }));
  };

  const value = {
    files,
    isLocked,
    vaultSettings,
    unlockVault,
    lockVault,
    addFile,
    removeFile,
    downloadFile,
    updateSettings
  };

  return (
    <VaultContext.Provider value={value}>
      {children}
    </VaultContext.Provider>
  );
};

export { VaultContext };
