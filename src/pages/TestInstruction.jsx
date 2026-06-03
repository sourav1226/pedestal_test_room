import { Container, Navbar, Card, Button, Form, Row, Col } from 'react-bootstrap';

function TestInstruction({ onStartTest }) {
  return (
    <div className="test-instruction-page">
      <Navbar className="header-nav">
        <Container fluid>
          <Navbar.Brand className="d-flex align-items-center">
            <div className="logo-box">
              <i className="bi bi-gem"></i>
            </div>
            <span className="ms-2 fw-bold">Pedestal Test Room</span>
          </Navbar.Brand>
          <div className="d-flex align-items-center gap-3">
            <div className="time-indicator">
              <i className="bi bi-clock me-2"></i>
              01:15:00
            </div>
            <div className="profile-avatar">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=User" alt="Profile" />
            </div>
          </div>
        </Container>
      </Navbar>

      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="instruction-card">
              <Card.Body className="p-4">
                <Row>
                  <Col lg={8}>
                    <div className="test-title">
                      <h2>AI Prompt Engineer Test</h2>
                      <p className="text-muted mb-4">Technical Assessment</p>
                    </div>

                    <div className="test-info mb-4">
                      <div className="info-item">
                        <i className="bi bi-question-circle"></i>
                        <span>Total Questions: <strong>30</strong></span>
                      </div>
                      <div className="info-item">
                        <i className="bi bi-award"></i>
                        <span>Total Marks: <strong>300</strong></span>
                      </div>
                    </div>

                    <div className="agreement-section">
                      <Form.Check
                        type="checkbox"
                        id="instructionCheck"
                        label="I have read and understood the instructions and agree to the terms and conditions of this assessment."
                        className="mb-3"
                      />
                      <Form.Check
                        type="checkbox"
                        id="termsCheck"
                        label="I confirm that I will not use any external resources or assistance during this test."
                        className="mb-3"
                      />
                    </div>

                    <div className="instructions-list mt-4">
                      <h5>Instructions:</h5>
                      <ul>
                        <li>Please read each question carefully before answering.</li>
                        <li>You can mark questions for review and come back later.</li>
                        <li>Do not refresh the page or close the browser during the test.</li>
                        <li>Ensure stable internet connection throughout the assessment.</li>
                      </ul>
                    </div>
                  </Col>

                  <Col lg={4}>
                    <Card className="summary-card">
                      <Card.Body>
                        <h5 className="mb-3">Test Summary</h5>
                        <div className="summary-stats">
                          <div className="stat-item">
                            <span className="stat-icon"><i className="bi bi-question-circle-fill"></i></span>
                            <div>
                              <small>Questions</small>
                              <h4>30</h4>
                            </div>
                          </div>
                          <div className="stat-item">
                            <span className="stat-icon"><i className="bi bi-star-fill"></i></span>
                            <div>
                              <small>Marks</small>
                              <h4>300</h4>
                            </div>
                          </div>
                          <div className="stat-item">
                            <span className="stat-icon"><i className="bi bi-clock-fill"></i></span>
                            <div>
                              <small>Remaining</small>
                              <h4>1:15</h4>
                            </div>
                          </div>
                        </div>

                        <div className="rules-list mt-3">
                          <p><i className="bi bi-check-circle text-success me-2"></i>Read instructions carefully</p>
                          <p><i className="bi bi-check-circle text-success me-2"></i>Note your answers</p>
                          <p><i className="bi bi-check-circle text-success me-2"></i>Do not refresh page</p>
                          <p><i className="bi bi-check-circle text-success me-2"></i>Submit when done</p>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <div className="text-center mt-4">
                  <Button className="start-test-btn" onClick={onStartTest}>
                    Start Test
                    <i className="bi bi-arrow-right ms-2"></i>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default TestInstruction;
