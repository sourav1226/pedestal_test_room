import { Modal, Button } from 'react-bootstrap';

function SubmitModal({ show, onHide, onConfirm, stats = { answered: 0, notAnswered: 0 }, submitting }) {
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
          <div className="remaining-count mt-3 d-flex gap-3">
            <div className="count-item">
              <span className="badge bg-success fs-6">{stats.answered} Answered</span>
            </div>
            <div className="count-item">
              <span className="badge bg-danger fs-6">{stats.notAnswered} Not Answered</span>
            </div>
          </div>
          {stats.notAnswered > 0 && (
            <p className="text-warning mt-2 mb-0">
              <i className="bi bi-exclamation-circle me-1"></i>
              You have {stats.notAnswered} unanswered question(s).
            </p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={submitting}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Test'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SubmitModal;
