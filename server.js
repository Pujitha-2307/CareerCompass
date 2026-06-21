const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.post("/generate", async (req, res) => {

    try {

        const prompt =
            req.body.contents[0].parts[0].text;

        const response = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",

                headers: {
                    "Authorization":
                        `Bearer ${process.env.GROQ_API_KEY}`,
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    model:
                        "llama-3.3-70b-versatile",

                    messages: [
                        {
                            role: "user",
                            content: prompt
                        }
                    ]

                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {
            return res.status(500).json(data);
        }

        res.json({
            candidates: [
                {
                    content: {
                        parts: [
                            {
                                text:
                                data.choices[0]
                                .message.content
                            }
                        ]
                    }
                }
            ]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    }

});

const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `Server running on ${PORT}`
    );
});