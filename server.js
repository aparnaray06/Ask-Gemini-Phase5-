import cors from "cors"
import express from "express";
import dotenv from "dotenv"

dotenv.config()
const app = express();
app.use(cors());
app.use(express.json())
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "public" });
});

//Ask Gemini================
app.post("/ask-gemini", async (req, res) => {
    try {
        const { question } = req.body;

        if (!question) {
            return res.status(400).json({
                error: "Question is required"
            });
        }

        //Create Prompt=============
        const prompt = `give me clean way answers of the ${question} in short`;

        //Call Gemini API============
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            }
        )

        //Get Gemini Response==========
        const data = await response.json();


        //Handle API Error==============
        if (!response.ok) {
            return res.status(response.status).json({
                error: data.error?.message || `gemini api error`
            });
        }

        //Extract Answer=================
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;

        return res.json({ answer });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'something went wrong'
        });
    }
});

//Start Server=============
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
