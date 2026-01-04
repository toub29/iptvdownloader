import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_STORAGE_ENCRYPTION_KEY || 'default-fallback-key';

export const encryptStorage = {
    getItem: (key) => {
        const item = localStorage.getItem(key);
        if (!item) return null;

        try {
            const bytes = CryptoJS.AES.decrypt(item, SECRET_KEY);
            const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            return decryptedData ? JSON.parse(decryptedData) : null;
        } catch (e) {
            console.error('Error decrypting data for key:', key, e);
            // En cas d'erreur (ex: changement de clé), on supprime la donnée corrompue
            localStorage.removeItem(key);
            return null;
        }
    },
    setItem: (key, value) => {
        try {
            const stringValue = JSON.stringify(value);
            const encryptedValue = CryptoJS.AES.encrypt(stringValue, SECRET_KEY).toString();
            localStorage.setItem(key, encryptedValue);
        } catch (e) {
            console.error('Error encrypting data for key:', key, e);
        }
    },
    removeItem: (key) => {
        localStorage.removeItem(key);
    }
};
