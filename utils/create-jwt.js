import axios from "axios";


async function createJWT() {
    const response = await axios.post(
        `${process.env.CTM_URL}/api/v1/auth/tokens`,
        {
            username: process.env.CTM_USERNAME,
            password: process.env.CTM_PASSWORD,
        }
    ).catch(err => {
        console.error(err);
        // res.status(502).send(err.toString());
    });

    const token = response.data.jwt;

    return token
}

export default createJWT;