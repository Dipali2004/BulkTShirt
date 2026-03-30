import CryptoJS from 'crypto-js';

const SECRET_KEY = 'U29tZVNlY3JldEtleUZvckVuY3J5cHRpb25BbmREZWNyeXB0aW9uS2V5MTIzNDU2Nzg5MA=='; // Base64 key

export const encrypt = (data: string): string => {
  const key = CryptoJS.enc.Base64.parse(SECRET_KEY);
  const encrypted = CryptoJS.AES.encrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};

export const decrypt = (cipherText: string): string => {
  const key = CryptoJS.enc.Base64.parse(SECRET_KEY);
  const decrypted = CryptoJS.AES.decrypt(cipherText, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};
