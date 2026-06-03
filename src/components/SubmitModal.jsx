import { Modal, Button, ListGroup } from 'react-bootstrap';

const submittedAnswers = [
  { q: 1, answer: "Prevent exploding gradients", answered: true },
  { q: 2, answer: "Adam", answered: true },
  { q: 3, answer: "Momentum", answered: true },
  { q: 4, answer: "Batch Normalization", answered: true },
  { q: 5, answer: "", answered: false },
  { q: 6, answer: "", answered: false },
  { q: 7, answer: "Dropout", answered: true },
  { q: 8, answer: "", answered: false },
  { q: 9, answer: "Transformer", answered: true },
  { q: 10, answer: "Attention", answered: true },
  { q: 11, answer: "", answered: false },
  { q: 12, answer: "", answered: false },
  { q: 13, answer: "", answered: false },
  { q: 14, answer: "", answered: false },
  { q: 15, answer: "", answered: false },
  { q: 16, answer: "", answered: false },
  { q: 17, answer: "", answered: false },
  { q: 18, answer: "", answered: false },
  { q: 19, answer: "", answered: false },
  { q: 20, answer: "", answered: false },
  { q: 21, answer: "", answered: false },
  { q: 22, answer: "", answered: false },
  { q: 23, answer: "", answered: false },
  { q: 24, answer: "", answered: false },
  { q: 25, answer: "", answered: false },
  { q: 26, answer: "", answered: false },
  { q: 27, answer: "", answered: false },
  { q: 28, answer: "", answered: false },
  { q: 29, answer: "", answered: false },
  { q: 30, answer: "", answered: false },
];

function SubmitModal({ show, onHide, onConfirm }) {
  const answered = submittedAnswers.filter(a => a.answered).length;
  const notAnswered = submittedAnswers.filter(a => !a.answered).length;

  return (
    <Modal show={show} onHide={onHide} centered className="submit-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-exclamation-triangle text-warning me-2"></i>
          Submit Test
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-3">Are you sure you want to submit the test?</p>
        
        <div className="summary-list">
          <h6>Answer Summary:</h6>
          <div className="answers-summary">
            {submittedAnswers.slice(0, 10).map((item, idx) => (
              <div key={idx} className={`answer-item ${item.answered ? 'answered' : 'not-answered'}`}>
                <span className="q-num">Q{item.q}</span>
                {item.answered ? (
                  <>
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    <span className="answer-text">{item.answer}</span>
                  </>
                ) : (
                  <>
                    <i className="bi bi-x-circle text-danger me-2"></i>
                    <span className="text-muted">Not Answered</span>
                  </>
                )}
              </div>
            ))}
            {submittedAnswers.length > 10 && (
              <div className="text-center text-muted mt-2">
                <small>+{submittedAnswers.length - 10} more questions</small>
              </div>
            )}
          </div>

          <div className="remaining-count mt-3">
            <div className="count-item">
              <span className="badge bg-success">{answered} Answered</span>
            </div>
            <div className="count-item">
              <span className="badge bg-danger">{notAnswered} Not Answered</span>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Submit Test
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SubmitModal;
