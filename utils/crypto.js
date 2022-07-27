import axios from "axios";


async function encryptData(file, jwt) {
    const fileBase64 = (await getBase64(file)).split(",")[1];
    const cipherText = await axios.post(
        `/api/encrypt-proxy`, {
            id: "s3-encrypt-symmetric-key",
            plaintext: fileBase64,
            add: "YXV0aGVudGljYXRl"
        }, {
            // Pass the JWT as a Bearer token.
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }).catch(err => {
            console.error(err);
            res.status(502).send(err.toString());
        });

    return cipherText.data;
}

// Function that converts our JS file object to base64 string.
const getBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    // handle errors
    reader.onerror = () => {
        console.error(reader.error);
        setOnFileReadError(true);
        reject(reader.error);
    };

});


// Decrypt data
async function decryptData(encryptedData, jwt) {
    const cipherText = await axios.post(
        `/api/decrypt-proxy`, {
            ...encryptedData,
            add: "YXV0aGVudGljYXRl"
        }, {
            // Pass the JWT as a Bearer token.
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }).catch(err => {
            console.error(err);
        });


    return cipherText.data;
}

export { encryptData, decryptData };