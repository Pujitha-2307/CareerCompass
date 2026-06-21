const API_KEY = "your_gemini_api_key_here";

const name = localStorage.getItem("name");
const career = localStorage.getItem("career");
const level = localStorage.getItem("level");
const hours = localStorage.getItem("hours");

/* ===========================
   USER INFO
=========================== */

document.getElementById("userInfo").innerHTML = `
<h3>Name: ${name}</h3>
<h3>Career Goal: ${career}</h3>
<h3>Current Level: ${level}</h3>
<h3>Study Time: ${hours} hrs/day</h3>
`;

/* ===========================
   GEMINI HELPER
=========================== */

async function askGemini(prompt) {

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`,
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
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error?.message || "API Request Failed"
        );
    }

    return data.candidates[0].content.parts[0].text;
}

/* ===========================
   ROADMAP
=========================== */
async function generateRoadmap() {

    document.getElementById("roadmapContainer").innerHTML =
        "<h3>Generating AI Roadmap...</h3>";

    const prompt = `
You are an expert career mentor.

Create a detailed career roadmap.

Name: ${name}
Career Goal: ${career}
Current Level: ${level}
Study Time: ${hours} hours/day

Provide:

1. 6-Month Learning Roadmap
2. Skills To Learn
3. Top 5 Projects To Build
4. Recommended Certifications
5. Expected Fresher Salary
6. Top Job Roles
7. Best Learning Resources
8. Career Tips

Format using headings and bullet points.
`;

    try {

        const result = await askGemini(prompt);

        document.getElementById("roadmapContainer").innerHTML = `
<div class="ai-content">
${result.replace(/\n/g,"<br><br>")}
</div>
`;
    } catch(error) {

        console.error(error);

        document.getElementById("roadmapContainer").innerHTML = `
            <div style="
                background:#fff1f2;
                padding:20px;
                border-radius:12px;
            ">
                <h3 style="color:red">
                    Failed to generate roadmap
                </h3>

                <p>${error.message}</p>

                <p>
                    Gemini API may be temporarily busy.
                    Please try again after a few seconds.
                </p>
            </div>
        `;
    }
}
generateRoadmap();
/* ===========================
   JOB READINESS
=========================== */

function calculateReadiness() {

    let score = 40;

    if(level === "Intermediate")
        score = 65;

    if(level === "Advanced")
        score = 85;

    if(Number(hours) >= 3)
        score += 10;

    document.getElementById(
        "readinessScore"
    ).innerText =
        score + "%";
}

calculateReadiness();

/* ===========================
   INTERVIEW QUESTIONS
=========================== */

document
.getElementById("interviewBtn")
.addEventListener(
    "click",
    generateInterviewQuestions
);

async function generateInterviewQuestions() {

    document.getElementById(
        "interviewContainer"
    ).innerHTML =
        "<p>Generating...</p>";

    const prompt = `
Generate 15 interview questions for a ${career}.

Include:
- Technical Questions
- HR Questions
- Scenario Based Questions

Current Level: ${level}
`;

    try {

        const result =
            await askGemini(prompt);

        document.getElementById(
    "interviewContainer"
).innerHTML =
`
<div class="ai-content">
${result.replace(/\n/g,"<br><br>")}
</div>
`;

    } catch(error) {

        document.getElementById(
            "interviewContainer"
        ).innerHTML =
            error.message;
    }
}

/* ===========================
   RESUME BUILDER
=========================== */

document
.getElementById("resumeBtn")
.addEventListener(
    "click",
    generateResume
);

async function generateResume() {

    document.getElementById(
        "resumeContainer"
    ).innerHTML =
        "<p>Generating...</p>";

    const prompt = `
Create a professional resume summary.

Name: ${name}
Career Goal: ${career}
Current Level: ${level}

Include:

1. Professional Summary
2. Skills
3. Projects
4. Strengths
`;

    try {

        const result =
            await askGemini(prompt);

        document.getElementById(
    "resumeContainer"
).innerHTML =
`
<div class="ai-content">
${result.replace(/\n/g,"<br><br>")}
</div>
`;

    } catch(error) {

        document.getElementById(
            "resumeContainer"
        ).innerHTML =
            error.message;
    }
}

/* ===========================
   SKILL GAP ANALYSIS
=========================== */

document
.getElementById("skillGapBtn")
.addEventListener(
    "click",
    generateSkillGap
);

async function generateSkillGap() {

    document.getElementById(
        "skillGapContainer"
    ).innerHTML =
        "<p>Analyzing...</p>";

    const prompt = `
Analyze the skill gap.

Career Goal: ${career}
Current Level: ${level}

Provide:

1. Missing Skills
2. Important Technologies
3. Learning Order
4. Priority Levels
5. Time To Become Job Ready
`;

    try {

        const result =
            await askGemini(prompt);

        document.getElementById(
    "skillGapContainer"
).innerHTML =
`
<div class="ai-content">
${result.replace(/\n/g,"<br><br>")}
</div>
`;

    } catch(error) {

        document.getElementById(
            "skillGapContainer"
        ).innerHTML =
            error.message;
    }
}

/* ===========================
   PDF DOWNLOAD
=========================== */
document.getElementById("downloadBtn")
.addEventListener("click", () => {

    const element =
        document.querySelector(".roadmap-card");

    const options = {
        margin: 10,
        filename: "CareerCompassRoadmap.pdf",
        html2canvas: {
            scale: 2
        },
        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait"
        }
    };

    html2pdf()
        .set(options)
        .from(element)
        .save();

});


/* ===========================
   CHART
=========================== */

function createChart() {

    const ctx =
        document.getElementById(
            "careerChart"
        );

    new Chart(ctx, {

        type: "bar",

        data: {

            labels: [
                "Skills",
                "Projects",
                "Certifications",
                "Interview Prep",
                "Job Readiness"
            ],

            datasets: [{
                label: "Career Growth Score",

                data: [
                    25,
                    45,
                    60,
                    75,
                    90
                ]
            }]
        },

        options: {
            responsive: true
        }

    });
}

createChart();

/* ===========================
   PROGRESS TRACKER
=========================== */

const checkboxes =
document.querySelectorAll(
'.progress-card input[type="checkbox"]'
);

checkboxes.forEach(
(checkbox,index)=>{

const saved =
localStorage.getItem(
`month-${index}`
);

checkbox.checked =
saved === "true";

checkbox.addEventListener(
"change",
()=>{

localStorage.setItem(
`month-${index}`,
checkbox.checked
);

});

});