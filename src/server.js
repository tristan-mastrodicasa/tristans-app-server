import express from 'express';

const server = express();
const port = process.env.PORT || 3000;

server.use('/', (req, res) => {
    return res.send({state: "Working"})
});

server.listen(port, () => {
    console.log(`Server up and running on localhost:${port}`);
})