import axios from "axios";


async function encryptData(base64EncodedData, jwt) {
    let file = base64EncodedData;
    const chunks = await splitFileToChunks(file);
    console.log(chunks);

    let cipherTextDataChunks = [];

    for (let chunk = 0; chunk < chunks.length; chunk++) {
        let cipherText = await axios.post(`/api/encrypt`, {
            chunk: chunks[chunk]
        }, {
            headers: {
                jwt: jwt,
            }
        });

        console.log(cipherText);

        cipherTextDataChunks.push(cipherText.data);
    }

    console.log(cipherTextDataChunks);
    // Send the encrypted ciphertext back to the client.
    return cipherTextDataChunks;
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


// `splitFileToChunks` splits a file into chunks of a given size.
// It returns an array of base64 encoded chunks.
async function splitFileToChunks(file, chunkSize = 524288) {
    const chunks = [];
    const chunkCount = Math.ceil(file.size / chunkSize);
    for (let i = 0; i < chunkCount; i++) {
        const start = i * chunkSize;
        const end = (i + 1) * chunkSize;
        const chunk = file.slice(start, end);
        const base64EncodedChunk = await getBase64(chunk);
        chunks.push(base64EncodedChunk.split(",")[1]);
    }
    return chunks;
}

export { encryptData };