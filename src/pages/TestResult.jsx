import { Container, Card, Button, Row, Col } from 'react-bootstrap'

function TestResult({ quiz, result, onViewLeaderboard, onBackToQuizzes }) {
  const percentage = result?.percentage || 0
  const passed = result?.result === 'pass'
  const score = result?.score || 0
  const totalMarks = quiz?.totalMarks || 0

  return (
    <div className="test-result-page">
      <div className="result-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Card className="result-card" style={{ maxWidth: 600, width: '100%' }}>
          <Card.Body className="p-5">
            <div className="result-header text-center mb-4">
              <h2 className="fw-bold">{passed ? '🎉 Test Completed!' : 'Test Completed'}</h2>
              <p className="text-muted">{quiz?.title}</p>
            </div>

            <div className="score-circle-container text-center mb-4">
              <div className="score-circle" style={{ position: 'relative', width: 180, height: 180, margin: '0 auto' }}>
                <svg viewBox="0 0 100 100" className="score-svg" style={{ width: '100%', height: '100%' }}>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e9ecef" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="45"
                    fill="none"
                    stroke={passed ? '#22c55e' : '#ef4444'}
                    strokeWidth="8"
                    strokeDasharray={`${(percentage / 100) * 283} 283`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="score-text" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <span className="score-number" style={{ fontSize: 36, fontWeight: 'bold', display: 'block' }}>{score}</span>
                  <span className="score-total" style={{ fontSize: 16, color: '#666' }}>/ {totalMarks}</span>
                  <div style={{ fontSize: 14, fontWeight: 'bold', color: passed ? '#22c55e' : '#ef4444', marginTop: 4 }}>
                    {percentage.toFixed(1)}% {passed ? '✅ Pass' : '❌ Fail'}
                  </div>
                </div>
              </div>
            </div>

            <Row className="stats-row justify-content-center mb-4 text-center">
              <Col xs={4}>
                <div className="stat-circle answered p-3">
                  <i className="bi bi-check-circle-fill text-success d-block" style={{ fontSize: 24 }}></i>
                  <span className="stat-count fw-bold d-block" style={{ fontSize: 20 }}>{result?.score || 0}</span>
                  <small>Score</small>
                </div>
              </Col>
              <Col xs={4}>
                <div className="stat-circle d-flex flex-column align-items-center p-3">
                  <i className={`bi ${passed ? 'bi-emoji-smile' : 'bi-emoji-frown'} d-block`} style={{ fontSize: 24, color: passed ? '#22c55e' : '#ef4444' }}></i>
                  <span className="fw-bold d-block" style={{ fontSize: 20 }}>{percentage.toFixed(0)}%</span>
                  <small>Percentage</small>
                </div>
              </Col>
              <Col xs={4}>
                <div className="stat-circle d-flex flex-column align-items-center p-3">
                  <i className={`bi ${passed ? 'bi-award' : 'bi-x-circle'} d-block`} style={{ fontSize: 24, color: passed ? '#f59e0b' : '#ef4444' }}></i>
                  <span className="fw-bold d-block" style={{ fontSize: 20 }}>{passed ? 'Pass' : 'Fail'}</span>
                  <small>Status</small>
                </div>
              </Col>
            </Row>

            <div className="result-actions text-center d-flex gap-3 justify-content-center flex-wrap">
              <Button variant="secondary" onClick={onBackToQuizzes}>
                <i className="bi bi-list me-2"></i>All Quizzes
              </Button>
              <Button className="submit-result-btn" variant="success" onClick={onViewLeaderboard}>
                View Leaderboard<i className="bi bi-arrow-right ms-2"></i>
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default TestResult
