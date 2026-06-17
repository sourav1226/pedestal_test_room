import { useState, useEffect } from 'react'
import { Container, Card, Nav, Table, Row, Col, Button } from 'react-bootstrap'
import leaderboardService from '../services/leaderboardService'

function Leaderboard({ quiz, onBack }) {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const data = await leaderboardService.getLeaderboard(quiz.id)
        setPlayers(data)
        setError(null)
      } catch (err) {
        setError('Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [quiz.id])

  if (loading) {
    return (
      <div className="leaderboard-page min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="fw-semibold">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="leaderboard-page min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Card className="p-4 text-center">
          <p className="text-red-600 mb-3">{error}</p>
          <Button variant="primary" onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="leaderboard-page" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="leaderboard-card shadow-lg">
              <Card.Body className="p-4">
                <div className="leaderboard-header mb-4 d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="fw-bold">
                      <i className="bi bi-trophy text-warning me-2"></i>Leaderboard
                    </h2>
                    <p className="text-muted mb-0">{quiz.title}</p>
                  </div>
                  <Button variant="outline-secondary" onClick={onBack}>
                    <i className="bi bi-arrow-left me-2"></i>Back
                  </Button>
                </div>

                <Nav variant="tabs" className="leaderboard-tabs mb-4">
                  <Nav.Item>
                    <Nav.Link active>All Participants</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link disabled>Top Scores</Nav.Link>
                  </Nav.Item>
                </Nav>

                <div className="table-responsive">
                  <Table className="leaderboard-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>User</th>
                        <th>Score</th>
                        <th>Percentage</th>
                        <th>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center text-muted py-4">
                            No participants yet.
                          </td>
                        </tr>
                      ) : (
                        players.map((user, idx) => (
                          <tr key={idx} className={user.isCurrentUser ? 'table-active fw-bold' : ''}>
                            <td>
                              <div className={`rank-badge rank-${user.rank}`}>
                                {user.rank <= 3 ? (
                                  <i className="bi bi-trophy-fill"></i>
                                ) : (
                                  user.rank
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="user-info d-flex align-items-center">
                                <img
                                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.studentName}`}
                                  alt={user.studentName}
                                  className="user-avatar me-3"
                                  style={{ width: 36, height: 36, borderRadius: '50%' }}
                                />
                                <span className="fw-medium">{user.studentName}</span>
                              </div>
                            </td>
                            <td>
                              <span className="score-badge badge bg-primary">{user.score}</span>
                            </td>
                            <td>
                              <span className="text-muted">{user.percentage}%</span>
                            </td>
                            <td>
                              <span className={`badge ${user.grade === 'F' ? 'bg-danger' : user.grade === 'A+' ? 'bg-success' : 'bg-info'}`}>
                                {user.grade}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Leaderboard
