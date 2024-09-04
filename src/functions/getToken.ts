import { decodeToken, isExpired } from "react-jwt";
import { handleDecryption } from "./handleCryptogaphy";

const getEncryptedToken = () => {
	const token = localStorage.getItem('Beacon-DMS-token');
	return token;
}

const getDecryptedToken = async () => {
	const token = getEncryptedToken();
	//console.log("Encrypted token",token);
	if (token==null)
		return null;
	const decryptedToken = await handleDecryption(token);
	//console.log("Decrypted token", decryptedToken)
	let decodedToken;
	if (decryptedToken["TKN"])
		decodedToken = await decodeToken(decryptedToken["TKN"]);
	else
		decodedToken = await decodeToken(decryptedToken);
	//console.log("Decoded token", decodedToken)
	const valid = isExpired(decryptedToken);
	if (!valid)
		return null;
	return await decodedToken;
}

export {getEncryptedToken, getDecryptedToken};