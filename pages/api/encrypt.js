import createJwt from "../../utils/create-jwt";
import axios from "axios";
import https from "https";

export default async function handler (req, res) {

    // const jwt = await createJwt();

    console.log("Break");

    // Let's encrypt our data using the Ciphertrust manager API.
    const cipherText = await axios.post(
        `${process.env.CTM_URL}/api/v1/crypto/encrypt`, {
            id: process.env.KEY_ID,
            plaintext: req.body.chunk,
            add: "YXV0aGVudGljYXRl"
        }, {
            // Pass the JWT as a Bearer token.
            headers: {
                Authorization: `Bearer ${req.headers.jwt}`
            }
        }).catch(err => {
            console.error(err);
            res.status(502).send(err.toString());
        });


    // Send the encrypted ciphertext back to the client.
    res.status(200).send(cipherText.data);

    // // It is best practice to set a cookie as httpOnly. Meaning that it cannot be modified by the browser.
    // // More info - https://blog.logrocket.com/jwt-authentication-best-practices/#:~:text=To%20reiterate%2C%20whatever%20you%20do,JWTs%20inside%20an%20httpOnly%20cookie.
    // const expiresIn = jwt.decode(token).exp;
    // // Leave the options as is. These options are needed to set the cookie securely.
    // const options = { maxAge: expiresIn, httpOnly: true, secure: process.env.NEXT_PUBLIC_SECURE_COOKIE === "true", path: '/' };
    // res.setHeader('Set-Cookie', [serialize('ciphertrustJWT', token, options)]);
    // res.status(200).send(`JWT: ${token}`);
}
