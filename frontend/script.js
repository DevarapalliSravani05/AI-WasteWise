/* =====================================
   AI WASTEWISE
   Gemini AI Frontend
===================================== */


/* =====================================
   TEXT WASTE ANALYSIS
===================================== */

const API_BASE_URL = "https://ai-wastewise-backend.onrender.com";

async function analyzeWaste() {

    const input = document
        .getElementById("wasteInput")
        .value
        .trim();


    // Check input

    if (input === "") {

        alert("Please enter a waste item first.");

        return;
    }


    const result =
        document.getElementById("result");


    // Show result area

    result.classList.remove("hidden");


    // Loading state

    document.getElementById(
        "resultIcon"
    ).textContent = "🤖";


    document.getElementById(
        "resultCategory"
    ).textContent = "Analyzing...";


    document.getElementById(
        "wasteType"
    ).textContent = "AI is processing";


    document.getElementById(
        "disposal"
    ).textContent = "Please wait";


    document.getElementById(
        "confidence"
    ).textContent = "Analyzing";


    document.getElementById(
        "recommendationText"
    ).textContent =
        "Gemini AI is analyzing the waste item...";


    document.getElementById(
        "tipText"
    ).textContent =
        "Generating sustainability advice...";


    try {

        /*
         * Send waste item to backend.
         *
         * IMPORTANT:
         * Gemini API key is never exposed
         * to the browser.
         */

        const response = await fetch(
    `${API_BASE_URL}/analyze-waste`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    waste: input
                })
            }
        );


        // Check server response

        if (!response.ok) {

            throw new Error(
                "Server returned an error."
            );

        }


        // Convert response to JSON

        const data =
            await response.json();


        /*
         * Display AI result
         */

        document.getElementById(
            "resultIcon"
        ).textContent =
            getCategoryIcon(data.category);


        document.getElementById(
            "resultCategory"
        ).textContent =
            data.category;


        document.getElementById(
            "wasteType"
        ).textContent =
            data.type;


        document.getElementById(
            "disposal"
        ).textContent =
            data.disposal;


        /*
         * Responsible AI confidence handling
         *
         * If the AI says the item needs
         * verification, never display
         * High confidence.
         */

        let confidence =
            data.confidence || "Unknown";


        if (
            data.category &&
            (
                data.category
                    .toLowerCase()
                    .includes("needs verification") ||

                data.category
                    .toLowerCase()
                    .includes("unknown") ||

                data.category
                    .toLowerCase()
                    .includes("uncertain")
            )
        ) {

            confidence = "Low";

        }


        document.getElementById(
            "confidence"
        ).textContent =
            confidence;


        /*
         * Display recommendation
         */

        document.getElementById(
            "recommendationText"
        ).textContent =
            data.recommendation;


        /*
         * Display sustainability tip
         */

        document.getElementById(
            "tipText"
        ).textContent =
            data.tip;


        /*
         * Console information
         */

        console.log(
            "AI Category:",
            data.category
        );

        console.log(
            "AI Confidence:",
            confidence
        );


        /*
         * Scroll to result
         */

        result.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }


    catch (error) {

        console.error(
            "Text AI Error:",
            error
        );


        document.getElementById(
            "resultIcon"
        ).textContent = "⚠️";


        document.getElementById(
            "resultCategory"
        ).textContent =
            "Analysis Failed";


        document.getElementById(
            "wasteType"
        ).textContent =
            "Try Again";


        document.getElementById(
            "disposal"
        ).textContent =
            "Unavailable";


        document.getElementById(
            "confidence"
        ).textContent =
            "Unavailable";


        document.getElementById(
            "recommendationText"
        ).textContent =
            "We could not connect to the AI service. Make sure the backend server is running.";


        document.getElementById(
            "tipText"
        ).textContent =
            "Please try again in a moment.";

    }

}


/* =====================================
   CATEGORY ICON
===================================== */

function getCategoryIcon(category) {

    if (!category) {

        return "🔍";

    }


    const text =
        category.toLowerCase();


    if (
        text.includes("recycl")
    ) {

        return "♻️";

    }


    if (
        text.includes("organic") ||
        text.includes("compost")
    ) {

        return "🍃";

    }


    if (
        text.includes("e-waste") ||
        text.includes("electronic") ||
        text.includes("hazard")
    ) {

        return "🔋";

    }


    if (
        text.includes("textile") ||
        text.includes("reusable")
    ) {

        return "👕";

    }


    if (
        text.includes("glass")
    ) {

        return "🫙";

    }


    if (
        text.includes("paper")
    ) {

        return "📄";

    }


    if (
        text.includes("needs verification") ||
        text.includes("unknown") ||
        text.includes("uncertain")
    ) {

        return "🔍";

    }


    return "🔍";

}


/* =====================================
   EXAMPLE BUTTONS
===================================== */

function setWaste(item) {

    const input =
        document.getElementById(
            "wasteInput"
        );


    input.value = item;


    input.focus();

}


/* =====================================
   ENTER KEY
===================================== */

const wasteInput =
    document.getElementById(
        "wasteInput"
    );


if (wasteInput) {

    wasteInput.addEventListener(
        "keypress",
        function (event) {

            if (event.key === "Enter") {

                analyzeWaste();

            }

        }
    );

}


/* =====================================
   IMAGE PREVIEW
===================================== */

function previewImage(event) {

    const file =
        event.target.files[0];


    if (!file) {

        return;

    }


    // Check that selected file is an image

    if (!file.type.startsWith("image/")) {

        alert(
            "Please select an image file."
        );


        event.target.value = "";


        return;

    }


    // Create image preview

    const reader =
        new FileReader();


    reader.onload = function (e) {

        document.getElementById(
            "imagePreview"
        ).src =
            e.target.result;


        document.getElementById(
            "imageName"
        ).textContent =
            file.name;


        document.getElementById(
            "imagePreviewContainer"
        ).classList.remove("hidden");

    };


    reader.readAsDataURL(file);

}


/* =====================================
   ANALYZE IMAGE WITH GEMINI
===================================== */

async function analyzeImage() {

    const imageInput =
        document.getElementById(
            "wasteImage"
        );


    const file =
        imageInput.files[0];


    if (!file) {

        alert(
            "Please select an image first."
        );


        return;

    }


    const result =
        document.getElementById(
            "result"
        );


    // Show result area

    result.classList.remove("hidden");


    // Loading state

    document.getElementById(
        "resultIcon"
    ).textContent = "🤖";


    document.getElementById(
        "resultCategory"
    ).textContent =
        "Analyzing Image...";


    document.getElementById(
        "wasteType"
    ).textContent =
        "AI is processing";


    document.getElementById(
        "disposal"
    ).textContent =
        "Please wait";


    document.getElementById(
        "confidence"
    ).textContent =
        "Analyzing";


    document.getElementById(
        "recommendationText"
    ).textContent =
        "Gemini AI is examining the uploaded image...";


    document.getElementById(
        "tipText"
    ).textContent =
        "Generating sustainability advice...";


    try {

        /*
         * Convert image to Base64
         */

        const base64Image =
            await convertImageToBase64(
                file
            );


        /*
         * Send image to backend
         */

        const response =
            await fetch(
    `${API_BASE_URL}/analyze-image`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        image:
                            base64Image,

                        mimeType:
                            file.type

                    })

                }
            );


        // Check server response

        if (!response.ok) {

            throw new Error(
                "Image analysis failed."
            );

        }


        /*
         * Convert response to JSON
         */

        const data =
            await response.json();


        /*
         * Display AI result
         */

        document.getElementById(
            "resultIcon"
        ).textContent =
            getCategoryIcon(
                data.category
            );


        document.getElementById(
            "resultCategory"
        ).textContent =
            data.category;


        document.getElementById(
            "wasteType"
        ).textContent =
            data.type;


        document.getElementById(
            "disposal"
        ).textContent =
            data.disposal;


        /*
         * Responsible AI confidence handling
         */

        let imageConfidence =
            data.confidence || "Unknown";


        if (
            data.category &&
            (
                data.category
                    .toLowerCase()
                    .includes("needs verification") ||

                data.category
                    .toLowerCase()
                    .includes("unknown") ||

                data.category
                    .toLowerCase()
                    .includes("uncertain")
            )
        ) {

            imageConfidence = "Low";

        }


        document.getElementById(
            "confidence"
        ).textContent =
            imageConfidence;


        /*
         * Display recommendation
         */

        document.getElementById(
            "recommendationText"
        ).textContent =
            data.recommendation;


        /*
         * Display sustainability tip
         */

        document.getElementById(
            "tipText"
        ).textContent =
            data.tip;


        /*
         * Console information
         */

        console.log(
            "Image AI Category:",
            data.category
        );

        console.log(
            "Image AI Confidence:",
            imageConfidence
        );


        /*
         * Scroll to result
         */

        result.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }


    catch (error) {

        console.error(
            "Image AI Error:",
            error
        );


        document.getElementById(
            "resultIcon"
        ).textContent =
            "⚠️";


        document.getElementById(
            "resultCategory"
        ).textContent =
            "Analysis Failed";


        document.getElementById(
            "wasteType"
        ).textContent =
            "Try Again";


        document.getElementById(
            "disposal"
        ).textContent =
            "Unavailable";


        document.getElementById(
            "confidence"
        ).textContent =
            "Unavailable";


        document.getElementById(
            "recommendationText"
        ).textContent =
            "The AI could not analyze this image. Please try another clear image.";


        document.getElementById(
            "tipText"
        ).textContent =
            "Use a clear image showing the waste item.";

    }

}


/* =====================================
   CONVERT IMAGE TO BASE64
===================================== */

function convertImageToBase64(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload = () => {

                /*
                 * Remove:
                 *
                 * data:image/...;base64,
                 *
                 * because the backend only
                 * needs the Base64 content.
                 */

                const base64 =
                    reader.result.split(",")[1];


                resolve(base64);

            };


            reader.onerror =
                reject;


            reader.readAsDataURL(
                file
            );

        }
    );

}