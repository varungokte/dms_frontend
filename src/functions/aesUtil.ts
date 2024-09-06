import crypto from "crypto";

const constants = {
  ENCRYPTION_KEY: 'JAIBAJRANGBALI' // Replace with your actual encryption key
};

const fnEncryptAES = async (data:object) => {
  try {
    if (!data) throw new Error('Invalid input');

    const algorithm = 'aes-256-cbc';
    const key = await crypto.createHash('sha256').update(constants.ENCRYPTION_KEY).digest().slice(0, 32);
    const iv = await crypto.randomBytes(16);

    const text = JSON.stringify(data);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const encryptedData = iv.toString('hex') + encrypted;
    return encryptedData;
  } catch (error) {
    console.log(error);
    throw new Error('Encryption failed');
  }
};

const fnDecryptAES = async (data) => {
  try {
    if (!data) throw new Error('Invalid input.');

    const algorithm = 'aes-256-cbc';
    const key = await crypto.createHash('sha256').update(constants.ENCRYPTION_KEY).digest().slice(0, 32);

    const encryptedBuffer = Buffer.from(data, 'hex');
    const iv = encryptedBuffer.slice(0, 16);
    const encryptedData = encryptedBuffer.slice(16);

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted); // Assuming helper.fnParseJSON is not available in React
  } catch (error) {
    console.error('Decryption failed:', error);
    throw new Error('Decryption failed');
  }
};

export {fnEncryptAES, fnDecryptAES};
