const fs = require('fs');
const docx = require('docx');
const axios = require('axios');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun } = docx;

// Function to fetch image using mermaid.ink base64
const getMermaidImage = async (code) => {
  // mermaid.ink requires JSON base64 encoded for maximum compatibility sometimes, or just code string base64.
  // Using JSON configuration to be safe.
  const state = {
    code: code,
    mermaid: { theme: 'default' },
    updateEditor: false,
    autoSync: true,
    updateDiagram: false
  };
  const jsonStr = JSON.stringify(state);
  // Base64Url encode
  const encoded = Buffer.from(jsonStr, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  
  const url = `https://mermaid.ink/img/${encoded}?type=png&bgColor=FFFFFF`;
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return response.data;
  } catch(e) {
    console.error("Failed to fetch image for: ", code.split('\n')[0]);
    if (e.response) {
      console.error(e.response.status, e.response.statusText);
    } else {
      console.error(e.message);
    }
    return null;
  }
};

const useCase = `flowchart LR
    Student((Student))
    Admin((Admin))
    
    subgraph System ["Quiz Portal"]
        UC1(Login / Authentication)
        UC2(Take Quiz)
        UC3(View Results)
        UC4(View Leaderboard)
        UC5(View Certificate)
        UC6(View Dashboard)
        UC7(Manage Quizzes)
        UC8(Manage Questions)
        UC9(View Analytics)
    end

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    
    Admin --> UC1
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
`;

const systemDesign = `graph TD
    subgraph Client
        UI[React UI]
        Router[React Router]
        State[Zustand]
    end
    subgraph Services
        APIClient[Axios API Client]
    end
    subgraph Backend
        REST[REST API Endpoints]
        MockDB[(Local Storage)]
    end
    UI --> Router
    UI --> State
    State --> APIClient
    APIClient -.-> REST
    REST -.-> MockDB
`;

const erDiagram = `erDiagram
    USER ||--o{ RESULT : "has many"
    QUIZ ||--|{ QUESTION : "contains"
    QUIZ ||--o{ RESULT : "generates"
    QUESTION ||--|{ OPTION : "has"
    RESULT ||--|| CERTIFICATE : "earns"
`;

const activityDiagram = `stateDiagram-v2
    [*] --> Login
    Login --> SelectRole
    SelectRole --> StudentDashboard
    SelectRole --> AdminDashboard
    StudentDashboard --> TakeQuiz
    TakeQuiz --> SubmitQuiz
    SubmitQuiz --> ViewResult
    ViewResult --> [*]
    AdminDashboard --> ManageQuizzes
    ManageQuizzes --> [*]
`;

const sequenceDiagram = `sequenceDiagram
    actor Student
    participant UI as Frontend Component
    participant Store as State Manager
    participant API as Backend Service
    Student->>UI: Submit Quiz
    UI->>Store: calculateFinalScore()
    UI->>API: POST /api/results
    API-->>UI: 201 Created
    UI->>Student: View Results
`;

async function generateDoc() {
  const images = [];
  const diagrams = [
    { title: '1. Use Case Diagram', code: useCase },
    { title: '2. System Design Architecture', code: systemDesign },
    { title: '3. Entity-Relationship (ER) Diagram', code: erDiagram },
    { title: '4. Activity Diagram', code: activityDiagram },
    { title: '5. Sequence Diagram', code: sequenceDiagram }
  ];

  for(const d of diagrams) {
    console.log("Fetching image for: " + d.title);
    const imgBuffer = await getMermaidImage(d.code);
    images.push({ title: d.title, buffer: imgBuffer });
  }

  const children = [
    new Paragraph({
      text: "Quiz Portal - Project Report",
      heading: HeadingLevel.HEADING_1
    }),
    new Paragraph({
      text: "This document contains the system design and architecture diagrams for the Quiz Portal project."
    }),
  ];

  for(const img of images) {
    children.push(new Paragraph({
      text: img.title,
      heading: HeadingLevel.HEADING_2
    }));
    
    if (img.buffer) {
      // Just supply a standard fixed width/height so docx doesn't complain and we don't need image-size.
      // Word will retain aspect ratio if we only specify one, wait docx ImageRun needs both in older versions, but let's see.
      children.push(new Paragraph({
        children: [
          new ImageRun({
            data: img.buffer,
            transformation: { width: 500, height: 350 }
          })
        ]
      }));
    } else {
      children.push(new Paragraph({ text: "[Failed to generate image from Mermaid notation]" }));
    }
    
    // Add some spacing
    children.push(new Paragraph({ text: "" }));
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('../Project_Report.docx', buffer);
  console.log("Created Project_Report.docx in parent directory.");
}

generateDoc().catch(console.error);
