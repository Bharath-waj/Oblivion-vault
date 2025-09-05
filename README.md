# 🔒 Oblivion Vault

Oblivion Vault is a **secure, encrypted vault application** for storing and retrieving sensitive files or text.  
It ensures **end-to-end encryption** with a simple, intuitive UI — giving users control of their data without relying on third-party trust.

---

## 🚩 Problem Statement
- User data and sensitive files are vulnerable to **unauthorized access** and **data breaches**.  
- Traditional storage often lacks **strong client-side protection** and **auditability**.  
- Need for a **lightweight, secure vault app** that balances usability with strong cryptography.  

---

## 🎯 Objectives
- Design a **secure, encrypted vault** to store files/text.  
- Guarantee **data confidentiality and integrity** using end-to-end encryption.  
- Provide a **seamless, user-friendly interface**.  
- Enable **safe backup and recovery mechanisms**.  

---

## 🛠️ Tech Stack
**Frontend:** React js ,CSS
**Encryption:** Advanced Encryption Standard **(AES)** in Galois/Counter Mode **(GCM)** client-side cryptography
**Backend:** Secure APIs (Supabase/Node.js)
**Authentication:** Secure login & session management


---

## 🔐 Key Features  
- **User-Friendly Vault Operations** → Add, view, manage, delete securely.  
- **Adaptive Key Management** → Password-derived keys, never hardcoded or stored.  
- **Decoy Vault** → provides an additional layer of security, displaying harmless fake files when you're under duress or facing unauthorised access attempts.
- **Fail-Safe Recovery** → Backup and restore with encrypted sync options.
- **True Client-Side Security** → All encryption/decryption happens locally in the browser/app. The server never sees plaintext or keys.

---

## 📐 Architecture / Flow

```text
Oblivion-Vault/
│
├── backend/                  # Backend code & APIs
│   └── supabase/
│       └── setup.md          # Backend setup instructions
│
├── frontend/                 # Frontend React app
│   ├── node_modules/         # Dependencies installed via npm/yarn
│   ├── public/               # Publicly accessible assets
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   │   └── robots.txt
│   │
│   ├── src/                  # Main source code
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React context providers (state management)
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Application pages/screens
│   │   ├── services/         # API calls, backend interactions
│   │   ├── styles/           # CSS/Styling files
│   │   ├── App.js            # Root React component
│   │   ├── index.css         # Global styles
│   │   ├── index.js          # Entry point for React app
│   │   └── logo.svg
│   │
│   ├── .env                  # Environment variables
│   ├── package-lock.json     # Dependency lock file
│   └── package.json          # Project metadata & dependencies
│
└── README.md                 # Project documentation

---

## ✅ Testing & Verification
- Unit tests for **encryption/decryption logic**.  
- Verified encrypted storage → No plaintext visible at any stage.  
- Secure API integration tests.  
- Usability testing for smooth vault operations.  

---

## 🚀 Future Enhancements
- 🔑 Multi-factor Authentication (MFA).  
- ☁️ Cloud backup with **zero-knowledge encryption**.  
- 📂 File versioning & recovery.  
- 📱 Biometric unlocking (fingerprint/face recognition) for mobile devices.  

---

## ⚡ Quick Start

### Prerequisites
- Node.js & npm installed
- Supabase (or backend API) configured

### Setup
```bash
# Clone the repo
git clone https://github.com/yourusername/oblivion-vault.git
cd oblivion-vault

# Install dependencies
npm install

# Start the frontend
npm start


**"Lock it. Encrypt it. Forget it — only you hold the key."**
