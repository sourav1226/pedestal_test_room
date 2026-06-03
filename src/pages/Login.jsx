import { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
    }
    setValidated(true);
    console.log('Login attempt:', { email, password });
  };

  return (
    <div className="login-page">
      <Row className="justify-content-center align-items-center min-vh-100">
        <Col md={5} lg={4}>
          <Card className="login-card shadow">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold text-primary">Assessment System</h2>
                <p className="text-muted">Sign in to continue</p>
              </div>
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a password.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3 d-flex justify-content-between">
                  <Form.Check type="checkbox" label="Remember me" />
                  <a href="#" className="text-decoration-none">Forgot password?</a>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 py-2">
                  Sign In
                </Button>
              </Form>

              <div className="text-center mt-4">
                <p className="mb-0">Don't have an account? <a href="#">Sign up</a></p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Login;
