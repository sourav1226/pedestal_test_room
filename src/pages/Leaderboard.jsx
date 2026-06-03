import { Container, Card, Nav, Table, Row, Col } from 'react-bootstrap';

const leaderboardData = [
  { rank: 1, name: "Anjali Thakur", score: 29, time: "45:20", avatar: "Anjali", completed: true },
  { rank: 2, name: "Dhruv Sharma", score: 26, time: "52:10", avatar: "Dhruv", completed: true },
  { rank: 3, name: "Manisha Kapoor", score: 22, time: "48:30", avatar: "Manisha", completed: true },
  { rank: 4, name: "Ram Patel", score: 19, time: "55:45", avatar: "Ram", completed: true },
  { rank: 5, name: "John Doe", score: 18, time: "01:15:00", avatar: "User", completed: true },
  { rank: 6, name: "Boni", score: 15, time: "01:02:30", avatar: "Boni", completed: true },
  { rank: 7, name: "Amit Kumar", score: 12, time: "58:20", avatar: "Amit", completed: false },
  { rank: 8, name: "Priya Singh", score: 10, time: "01:10:00", avatar: "Priya", completed: false },
];

function Leaderboard() {
  return (
    <div className="leaderboard-page">
      
      <Container className="py-4">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="leaderboard-card">
              <Card.Body className="p-4">
                <div className="leaderboard-header mb-4">
                  <h2 className="fw-bold">
                    <i className="bi bi-trophy text-warning me-2"></i>
                    Leaderboard
                  </h2>
                  <p className="text-muted">AI Prompt Engineer Test</p>
                </div>

                <Nav variant="tabs" className="leaderboard-tabs mb-4">
                  <Nav.Item>
                    <Nav.Link active>All Sections</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link>Top Scores</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link>Format Test</Nav.Link>
                  </Nav.Item>
                </Nav>

                <div className="table-responsive">
                  <Table className="leaderboard-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>User</th>
                        <th>Score</th>
                        <th>Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.map((user) => (
                        <tr key={user.rank} className={user.rank === 5 ? 'current-user' : ''}>
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
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`}
                                alt={user.name}
                                className="user-avatar me-3"
                              />
                              <span className="fw-medium">{user.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="score-badge">{user.score}</span>
                          </td>
                          <td>
                            <span className="time-text">{user.time}</span>
                          </td>
                          <td>
                            <span className={`status-badge ${user.completed ? 'completed' : 'in-progress'}`}>
                              {user.completed ? (
                                <>
                                  <i className="bi bi-check-circle-fill me-1"></i>
                                  Completed
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-clock me-1"></i>
                                  In Progress
                                </>
                              )}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Leaderboard;
