import { useState } from 'react';
import { Container, Navbar, Card, Button, Form, Row, Col } from 'react-bootstrap';
import SubmitModal from '../components/SubmitModal';

const questions = [
  {
    id: 1,
    text: "What is the main purpose of gradient clipping?",
    options: [
      "Increase learning rate",
      "Prevent exploding gradients",
      "Reduce dataset size",
      "Improve activation functions"
    ]
  },
  {
    id: 2,
    text: "Which optimization technique uses momentum?",
    options: [
      "SGD",
      "Adam",
      "RMSprop",
      "All of the above"
    ]
  }
];

const questionStatus = Array(30).fill('not-visited');
questionStatus[0] = 'answered';
questionStatus[1] = 'answered';
questionStatus[2] = 'marked';
questionStatus[3] = 'skipped';

function QuestionAttempt({ onSubmit }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [markedForReview, setMarkedForReview] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleAnswerSelect = (index) => {
    setSelectedAnswer(index);
  };

  return (
    <div className="question-attempt-page">
      <Navbar className="header-nav">
        <Container fluid>
          <Navbar.Brand className="d-flex align-items-center">
            <div className="logo-box">
              <i className="bi bi-gem"></i>
            </div>
            <span className="ms-2 fw-bold">Quiz Portal</span>
          </Navbar.Brand>
          <div className="d-flex align-items-center gap-3">
            <span className="earn-points">
              <i className="bi bi-trophy me-1"></i> Earn Points
            </span>
          </div>
        </Container>
      </Navbar>

      <Container fluid className="py-3">
        <Row>
          <Col lg={9}>
            <Card className="question-card">
              <Card.Body className="p-4">
                <div className="question-header mb-4">
                  <span className="question-number">Question-{currentQuestion + 1}</span>
                  <span className="question-marks">10 Marks</span>
                </div>

                <div className="question-text mb-4">
                  <h4>{questions[currentQuestion].text}</h4>
                </div>

                <div className="options-list">
                  {questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={index}
                      className={`option-card ${selectedAnswer === index ? 'selected' : ''}`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <div className="option-indicator">
                        {selectedAnswer === index ? (
                          <i className="bi bi-check-circle-fill"></i>
                        ) : (
                          <div className="option-letter">{String.fromCharCode(65 + index)}</div>
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  ))}
                </div>

                <div className="question-controls mt-4">
                  <Form.Check
                    type="checkbox"
                    id="markReview"
                    label="Mark for Review"
                    checked={markedForReview}
                    onChange={(e) => setMarkedForReview(e.target.checked)}
                    className="d-inline-block me-4"
                  />
                  <Button
                    className="save-next-btn"
                    onClick={() => {
                      if (currentQuestion < questions.length - 1) {
                        setCurrentQuestion(currentQuestion + 1);
                        setSelectedAnswer(null);
                        setMarkedForReview(false);
                      }
                    }}
                  >
                    Save & Next
                    <i className="bi bi-arrow-right ms-2"></i>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3}>
            <Card className="sidebar-card">
              <Card.Body className="p-3">
                <div className="user-info text-center mb-3">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                    alt="Profile"
                    className="user-avatar mb-2"
                  />
                  <h6 className="mb-0">John Doe</h6>
                  <small className="text-muted">AI Prompt Engineer</small>
                </div>

                <div className="test-status mb-3">
                  <div className="status-item">
                    <span className="status-label">Time Left</span>
                    <span className="status-value time-left">01:15:00</span>
                  </div>
                  <div className="status-item">
                    <span className="status-label">Marks Scored</span>
                    <span className="status-value">18</span>
                  </div>
                </div>

                <div className="legend mb-3">
                  <div className="legend-item">
                    <span className="legend-color answered"></span>
                    <small>Answered</small>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color marked"></span>
                    <small>Marked</small>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color skipped"></span>
                    <small>Skipped</small>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color not-visited"></span>
                    <small>Not Visited</small>
                  </div>
                </div>

                <div className="question-navigator">
                  <h6 className="mb-2">Question Navigator</h6>
                  <div className="question-grid">
                    {questionStatus.map((status, index) => (
                      <div
                        key={index}
                        className={`question-box ${status} ${index === currentQuestion ? 'current' : ''}`}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="submit-test-btn w-100 mt-3" onClick={() => setShowModal(true)}>
                  Submit Test
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <SubmitModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={() => {
          setShowModal(false);
          onSubmit();
        }}
      />
    </div>
  );
}

export default QuestionAttempt;
