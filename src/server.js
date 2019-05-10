import express from 'express';

const server = express();
const port = process.env.PORT || 3000;

server.listen(port, "127.0.0.1", () => {
    console.log(`Server up and running on 127.0.0.1:${port}`);
})