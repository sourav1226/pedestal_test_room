const fs = require('fs');
const docx = require('docx');
const axios = require('axios');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, ImageRun } = docx;

// Function to fetch image using mermaid.ink base64
const getMermaidImage = async (code) => {
  const state = {
    code: code,
    mermaid: { theme: 'default' },
    updateEditor: false,
    autoSync: true,
    updateDiagram: false
  };
  const jsonStr = JSON.stringify(state);
  const encoded = Buffer.from(jsonStr, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  
  const url = `https://mermaid.ink/img/${encoded}?type=png&bgColor=FFFFFF`;
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return response.data;
  } catch(e) {
    console.error("Failed to fetch image");
    return null;
  }
};

const archCode = `graph TD
    subgraph Frontend
        UI[React UI]
        State[Zustand Store]
        Router[React Router]
        APIClient[Axios Client]
    end
    subgraph Backend
        App[Express App]
        Routes[API Routes]
        Controllers[Controllers]
    end
    subgraph Database
        DB[(MySQL Database)]
    end
    Router --> UI
    UI <--> State
    UI --> APIClient
    State --> APIClient
    APIClient ==> App
    App --> Routes
    Routes --> Controllers
    Controllers -.-> DB
`;

const erCode = `erDiagram
    COURSES ||--o{ QUIZZES : contains
    BATCHES ||--o{ QUIZZES : assigned_to
    QUIZZES ||--|{ QUESTIONS : has
    USERS ||--o{ QUIZ_ATTEMPTS : makes
    QUIZZES ||--o{ QUIZ_ATTEMPTS : taken_in
    QUIZ_ATTEMPTS ||--|| RESULTS : generates
    RESULTS ||--|| CERTIFICATES : earns
`;

const classCode = `classDiagram
    class users {
        +BIGINT id PK
        +VARCHAR full_name
        +VARCHAR email
        +ENUM status
    }
    class quizzes {
        +BIGINT id PK
        +VARCHAR title
        +INT duration_minutes
        +INT passing_marks
    }
    class questions {
        +BIGINT id PK
        +BIGINT quiz_id FK
        +ENUM question_type
        +DECIMAL marks
    }
    class quiz_attempts {
        +BIGINT id PK
        +BIGINT quiz_id FK
        +BIGINT student_id FK
        +ENUM status
    }
    class results {
        +BIGINT attempt_id FK
        +DECIMAL percentage
        +ENUM result_status
    }
    users "1" *-- "*" quiz_attempts
    quizzes "1" *-- "*" quiz_attempts
    quiz_attempts "1" -- "1" results
`;

const seqCode = `sequenceDiagram
    actor Student
    participant UI as React Frontend
    participant AttemptAPI as Attempt Controller
    participant ResultAPI as Result Controller
    participant DB as MySQL DB
    Student->>UI: Submit Quiz
    UI->>AttemptAPI: PUT /api/attempts/submit
    AttemptAPI->>DB: UPDATE quiz_attempts
    AttemptAPI->>ResultAPI: Calculate Score
    ResultAPI->>DB: INSERT INTO results
    ResultAPI-->>AttemptAPI: Result Summary
    AttemptAPI-->>UI: 200 OK (Final Score)
    UI->>Student: Displays Result Page
`;

async function generateDoc() {
  const images = [];
  const diagrams = [
    { title: '1. Comprehensive System Architecture', code: archCode },
    { title: '2. Deep Entity-Relationship (ER) Diagram', code: erCode },
    { title: '3. Database Schema Models (UML Class Diagram)', code: classCode },
    { title: '4. End-to-End Sequence Diagram (Taking a Quiz)', code: seqCode }
  ];

  for(const d of diagrams) {
    console.log("Fetching image for: " + d.title);
    const imgBuffer = await getMermaidImage(d.code);
    images.push({ title: d.title, buffer: imgBuffer });
  }

  const children = [
    new Paragraph({
      text: "Quiz Portal - Detailed Project Report",
      heading: HeadingLevel.HEADING_1
    }),
    new Paragraph({
      text: "This document contains the in-depth system architecture, comprehensive database schema, and detailed sequence flows based on the backend Express application and MySQL database."
    }),
    new Paragraph({ text: "" }),
  ];

  for(const img of images) {
    children.push(new Paragraph({
      text: img.title,
      heading: HeadingLevel.HEADING_2
    }));
    
    if (img.buffer) {
      children.push(new Paragraph({
        children: [
          new ImageRun({
            data: img.buffer,
            transformation: { width: 500, height: 350 }
          })
        ]
      }));
    } else {
      children.push(new Paragraph({ text: "[Failed to generate image]" }));
    }
    
    children.push(new Paragraph({ text: "" }));
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: children
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('../Project_Report_Detailed.docx', buffer);
  console.log("Created Project_Report_Detailed.docx in parent directory.");
}

generateDoc().catch(console.error);
