const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


// Check API key
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing in .env");
    process.exit(1);
}

// Gemini client
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


/* =====================================
   AI WASTE ANALYSIS
===================================== */

app.post("/analyze-waste", async (req, res) => {

    try {

        const { waste } = req.body;

        if (!waste || waste.trim() === "") {

            return res.status(400).json({
                error: "Please provide a waste item."
            });

        }


        const prompt = `
You are AI WasteWise, a responsible AI assistant
for sustainable waste management.

Analyze this waste item:

"${waste}"

Your job is to classify the waste and provide
a safe disposal recommendation.

Return ONLY valid JSON using exactly this structure:

{
  "category": "string",
  "type": "string",
  "disposal": "string",
  "recommendation": "string",
  "tip": "string",
  "confidence": "High/Medium/Low"
}

Rules:

1. Identify the most appropriate waste category.
2. Identify the material or waste type.
3. Provide a practical disposal recommendation.
4. Provide one sustainability tip.
5. If the item is ambiguous, set category to
   "Needs Verification".
6. If uncertain, set confidence to "Low".
7. Never pretend to be certain when information is unclear.
8. Do not invent local recycling regulations.
9. Keep the response simple and understandable.
`;


        /*
         * Gemini Interactions API
         *
         * Current recommended API for new applications.
         */

        const interaction = await ai.interactions.create({

            model: "gemini-3.6-flash",

            input: prompt,

            store: false

        });


        const text = interaction.output_text;


        if (!text) {

            throw new Error(
                "Gemini returned an empty response."
            );

        }


        console.log("Gemini response:");

        console.log(text);


        /*
         * Remove possible markdown code fences
         */

        const cleanText = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();


        /*
         * Convert AI response into JSON
         */

        const result = JSON.parse(cleanText);


        res.json(result);

    }

    catch (error) {

        console.error("AI Error:", error);

        res.status(500).json({

            error:
                "Unable to analyze the waste item.",

            details:
                error.message

        });

    }

});

/* =====================================
   IMAGE WASTE ANALYSIS
===================================== */

app.post("/analyze-image", async (req, res) => {

    try {

        const { image, mimeType } = req.body;


        // Validate image

        if (!image || !mimeType) {

            return res.status(400).json({
                error: "Image data is missing."
            });

        }


        const prompt = `
You are AI WasteWise, a responsible AI assistant
for sustainable waste management.

Analyze the waste item shown in the uploaded image.

Identify:

1. What the object appears to be.
2. Its likely waste/material type.
3. The appropriate waste category.
4. A practical disposal recommendation.
5. One sustainability tip.
6. Your confidence level.

Return ONLY valid JSON in exactly this structure:

{
  "category": "string",
  "type": "string",
  "disposal": "string",
  "recommendation": "string",
  "tip": "string",
  "confidence": "High/Medium/Low"
}

Rules:

- Analyze only what is reasonably visible in the image.
- Do not invent information that cannot be determined.
- If the image is unclear or the item cannot be identified,
  use "Needs Verification" as the category.
- If uncertain, use "Low" confidence.
- Do not invent local recycling regulations.
- Give simple and practical advice.
`;


        /*
         * Send the image and prompt to Gemini
         */

        const interaction = await ai.interactions.create({

            model: "gemini-3.6-flash",

            input: [

                {
                    type: "text",

                    text: prompt
                },

                {
                    type: "image",

                    data: image,

                    mime_type: mimeType
                }

            ],

            store: false

        });


        const text = interaction.output_text;


        if (!text) {

            throw new Error(
                "Gemini returned an empty response."
            );

        }


        console.log("Gemini image response:");

        console.log(text);


        /*
         * Remove markdown code fences
         */

        const cleanText = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();


        /*
         * Convert AI response to JSON
         */

        const result = JSON.parse(cleanText);

        // Responsible AI: Never show high confidence
// when the AI cannot identify the waste.
if (
    result.category &&
    result.category.toLowerCase().includes("needs verification")
) {
    result.confidence = "Low";
}


        res.json(result);

    }

    catch (error) {

        console.error(
            "Image AI Error:",
            error
        );


        res.status(500).json({

            error:
                "Unable to analyze the image.",

            details:
                error.message

        });

    }

});

/* =====================================
   SERVER
===================================== */

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `♻️ AI WasteWise backend running on port ${PORT}`
    );

});