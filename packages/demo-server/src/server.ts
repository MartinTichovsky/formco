import * as cors from "cors";
import * as express from "express";

const app = express();
const port = 3000;

const wait = async (timeout: number) => new Promise((executor) => setTimeout(executor, timeout));

app.use(cors());
app.use(express.json());

const registered = [
    { email: "james@email.com", username: "james" },
    { email: "bond@email.com", username: "bond" },
    { email: "jamesbond@email.com", username: "jamesbond" }
];

app.post("/email", async (req, res) => {
    await wait(2000);
    res.json({
        isValid: !registered.find((item) => item.email === req.body.email)
    });
});

app.post("/register", async (req, res) => {
    await wait(4000);
    if (
        !req.body.email ||
        !req.body.username ||
        registered.find((item) => item.email === req.body.email && item.username === req.body.username)
    ) {
        res.json({ error: "Register failed" });
    } else {
        registered.push({ email: req.body.email, username: req.body.username });
        res.json({ ok: true });
    }
});

app.post("/username", async (req, res) => {
    await wait(2000);
    res.json({
        isValid: !registered.find((item) => item.username === req.body.username)
    });
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
