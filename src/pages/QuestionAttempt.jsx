import { useState, useEffect, useCallback } from 'react'
import { Container, Navbar, Card, Button, Form, Row, Col, Alert } from 'react-bootstrap'
import { apiClient } from '../services/ApiService'
import attemptService from '../services/attemptService'
import SubmitModal from '../components/SubmitModal'

function QuestionAttempt({ quiz, attempt, onSubmit }) {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [markedForReview, setMarkedForReview] = useState({})
  const [visitedQuestions, setVisitedQuestions] = useState(new Set())
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [timeLeft, setTimeLeft] = useState(quiz.duration * 60)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const { data } = await apiClient.get(`/questions/quiz/${quiz.id}`)
        setQuestions(data.questions || [])
      } catch (err) {
        setError('Failed to load questions')
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [quiz.id])

  useEffect(() => {
    if (timeLeft <= 0 && !submitted) {
      handleSubmitTest()
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, submitted])

  useEffect(() => {
    if (questions.length > 0 && currentIndex >= 0) {
      setVisitedQuestions((prev) => new Set([...prev, currentIndex]))
    }
  }, [currentIndex, questions.length])

  const currentQuestion = questions[currentIndex]

  const handleAnswerSelect = (optionId) => {
    if (submitted) return
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { question_id: currentQuestion.id, selected_option_id: optionId }
    }))
  }

  const handleFillBlanks = (text) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: { question_id: currentQuestion.id, answer_text: text }
    }))
  }

  const toggleReview = () => {
    setMarkedForReview((prev) => ({
      ...prev,
      [currentIndex]: !prev[currentIndex]
    }))
  }

  const goToQuestion = (index) => {
    setCurrentIndex(index)
  }

  const handleSaveNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleSubmitTest = useCallback(async () => {
    if (submitted) return
    setSubmitting(true)
    setSubmitted(true)
    try {
      const answersArray = Object.values(answers)
      const result = await attemptService.submitAttempt(attempt.id, answersArray)
      onSubmit(result)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit test')
      setSubmitted(false)
    } finally {
      setSubmitting(false)
    }
  }, [answers, attempt, onSubmit, submitted])

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const isAnswered = (qId) => answers[qId] && (answers[qId].selected_option_id || answers[qId].answer_text)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No questions available.</p>
      </div>
    )
  }

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
            <span className={`earn-points ${timeLeft < 300 ? 'text-danger' : ''}`}>
              <i className="bi bi-clock me-1"></i> {formatTime(timeLeft)}
            </span>
          </div>
        </Container>
      </Navbar>

      <Container fluid className="py-3">
        {error && <Alert variant="danger" className="mx-3">{error}</Alert>}
        <Row>
          <Col lg={9}>
            <Card className="question-card">
              <Card.Body className="p-4">
                <div className="question-header mb-4 d-flex justify-content-between align-items-center">
                  <span className="question-number fw-bold">Question {currentIndex + 1} of {questions.length}</span>
                  <span className="question-marks badge bg-primary">{currentQuestion.marks} Marks</span>
                </div>

                <div className="question-text mb-4">
                  <h4>{currentQuestion.question_text}</h4>
                </div>

                <div className="options-list">
                  {(currentQuestion.options || []).map((option) => (
                    <div
                      key={option.id}
                      className={`option-card ${answers[currentQuestion.id]?.selected_option_id === option.id ? 'selected' : ''}`}
                      onClick={() => {
                        if (currentQuestion.question_type === 'fill_blanks') return
                        handleAnswerSelect(option.id)
                      }}
                      style={{ cursor: currentQuestion.question_type === 'fill_blanks' ? 'default' : 'pointer' }}
                    >
                      <div className="option-indicator">
                        {answers[currentQuestion.id]?.selected_option_id === option.id ? (
                          <i className="bi bi-check-circle-fill text-primary"></i>
                        ) : (
                          <div className="option-letter">{String.fromCharCode(65 + (currentQuestion.options || []).indexOf(option))}</div>
                        )}
                      </div>
                      <span>{option.option_text}</span>
                    </div>
                  ))}
                </div>

                {currentQuestion.question_type === 'fill_blanks' && (
                  <div className="mt-3">
                    <Form.Control
                      type="text"
                      placeholder="Type your answer..."
                      value={answers[currentQuestion.id]?.answer_text || ''}
                      onChange={(e) => handleFillBlanks(e.target.value)}
                    />
                  </div>
                )}

                <div className="question-controls mt-4 d-flex justify-content-between align-items-center">
                  <Form.Check
                    type="checkbox"
                    id="markReview"
                    label="Mark for Review"
                    checked={!!markedForReview[currentIndex]}
                    onChange={toggleReview}
                    className="d-inline-block"
                  />
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-secondary"
                      onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
                      disabled={currentIndex === 0}
                    >
                      <i className="bi bi-arrow-left me-1"></i>Previous
                    </Button>
                    {currentIndex < questions.length - 1 ? (
                      <Button className="save-next-btn" onClick={handleSaveNext}>
                        Save & Next<i className="bi bi-arrow-right ms-2"></i>
                      </Button>
                    ) : (
                      <Button className="save-next-btn" onClick={() => setShowModal(true)}>
                        Submit Test<i className="bi bi-check-circle ms-2"></i>
                      </Button>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3}>
            <Card className="sidebar-card">
              <Card.Body className="p-3">
                <div className="test-status mb-3">
                  <div className="status-item d-flex justify-content-between mb-2">
                    <span className="status-label">Time Left</span>
                    <span className={`status-value fw-bold ${timeLeft < 300 ? 'text-danger' : ''}`}>{formatTime(timeLeft)}</span>
                  </div>
                  <div className="status-item d-flex justify-content-between">
                    <span className="status-label">Questions</span>
                    <span className="status-value">{Object.keys(answers).length}/{questions.length}</span>
                  </div>
                </div>

                <div className="legend mb-3 d-flex flex-wrap gap-3">
                  <div className="d-flex align-items-center gap-1">
                    <span className="legend-color answered d-inline-block" style={{ width: 12, height: 12, borderRadius: 2 }}></span>
                    <small>Answered</small>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <span className="legend-color marked d-inline-block" style={{ width: 12, height: 12, borderRadius: 2 }}></span>
                    <small>Marked</small>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <span className="legend-color not-visited d-inline-block" style={{ width: 12, height: 12, borderRadius: 2 }}></span>
                    <small>Not Visited</small>
                  </div>
                </div>

                <div className="question-navigator">
                  <h6 className="mb-2">Question Navigator</h6>
                  <div className="question-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
                    {questions.map((q, idx) => (
                      <div
                        key={q.id}
                        onClick={() => goToQuestion(idx)}
                        className={`question-box text-center p-1 rounded ${
                          idx === currentIndex ? 'current border border-primary' : ''
                        } ${
                          markedForReview[idx] ? 'bg-warning text-dark' :
                          isAnswered(q.id) ? 'bg-success text-white' :
                          visitedQuestions.has(idx) ? 'bg-secondary text-white' :
                          'bg-light'
                        }`}
                        style={{ cursor: 'pointer', fontSize: 12 }}
                      >
                        {idx + 1}
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className="submit-test-btn w-100 mt-3"
                  variant="danger"
                  onClick={() => setShowModal(true)}
                  disabled={submitted}
                >
                  Submit Test
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <SubmitModal
        show={showModal}
        onHide={() => !submitting && setShowModal(false)}
        onConfirm={handleSubmitTest}
        stats={{ answered: Object.keys(answers).length, notAnswered: questions.length - Object.keys(answers).length }}
        submitting={submitting}
      />
    </div>
  )
}

export default QuestionAttempt
