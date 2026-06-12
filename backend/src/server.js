import express from 'express';
import "dotenv/config";
const app = express();

app.get("/", (req, res) => {
    res.send("This is the backend server.");
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})


