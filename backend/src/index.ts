import express from 'express';

const app = express();
const port: number = 3000;

app.get('/', (_req, res) => {
    res.send('Hello TypeScript Backend!');
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
