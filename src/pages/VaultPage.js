
import React from 'react';
import Vault from '../components/Vault';
import DecoyVault from '../components/DecoyVault';


export default function VaultPage() {
  return (
    <div className="vault-page">
      <Vault />
      <DecoyVault />
    </div>
  );
}
