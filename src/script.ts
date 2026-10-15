import { prisma } from "../lib/prisma.js";
import express from "express";
import bcrypt from "bcrypt";
const app = express();

app.use(express.json()); // Essential for parsing JSON request bodies

app.post("/user", async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Hash the password securely with 10 salt rounds and await the result
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            // @ts-ignore
            data: {
                username,
                password: hashedPassword
            }
        });

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        // @ts-ignore
        res.status(500).json({ error: "Failed to create user", details: error.message });
    }
});

app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json({ users });
});

app.get("/todos/:id", async (req, res) => {
    const id = req.params.id;

    const user = await prisma.user.findFirst({
        where: {
            id: parseInt(id)
        },
        select: {
            todos: true,
            username: true,
            password: true,
        }
    });
    res.json({ user });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});