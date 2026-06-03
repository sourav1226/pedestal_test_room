import { Container, Card, Button, Row, Col } from 'react-bootstrap';

function TestResult({ onViewLeaderboard }) {
  const stats = {
    score: 18,
    total: 30,
    answered: 20,
    notAnswered: 10,
    marked: 2
  };

  return (
    <div className="test-result-page">
      <div className="result-container">
        <Card className="result-card">
          <Card.Body className="p-5">
            <div className="result-header text-center mb-4">
              <h2 className="fw-bold">Test Completed!</h2>
              <p className="text-muted">AI Prompt Engineer Test</p>
            </div>

            <div className="score-circle-container text-center mb-4">
              <div className="score-circle">
                <svg viewBox="0 0 100 100" className="score-svg">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#e9ecef"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#667eea"
                    strokeWidth="8"
                    strokeDasharray={`${(stats.score / stats.total) * 283} 283`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="score-text">
                  <span className="score-number">{stats.score}</span>
                  <span className="score-total">/ {stats.total}</span>
                </div>
              </div>
            </div>

            <Row className="stats-row justify-content-center mb-4">
              <Col xs={4}>
                <div className="stat-circle answered">
                  <div className="stat-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <span className="stat-count">{stats.answered}</span>
                  <small>Answered</small>
                </div>
              </Col>
              <Col xs={4}>
                <div className="stat-circle not-answered">
                  <div className="stat-icon">
                    <i className="bi bi-x-circle-fill"></i>
                  </div>
                  <span className="stat-count">{stats.notAnswered}</span>
                  <small>Not Answered</small>
                </div>
              </Col>
              <Col xs={4}>
                <div className="stat-circle marked">
                  <div className="stat-icon">
                    <i className="bi bi-bookmark-fill"></i>
                  </div>
                  <span className="stat-count">{stats.marked}</span>
                  <small>Marked</small>
                </div>
              </Col>
            </Row>

            <div className="result-actions text-center">
              <Button variant="secondary" className="me-3">
                Cancel
              </Button>
              <Button className="submit-result-btn" onClick={onViewLeaderboard}>
                View Leaderboard
                <i className="bi bi-arrow-right ms-2"></i>
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default TestResult;
