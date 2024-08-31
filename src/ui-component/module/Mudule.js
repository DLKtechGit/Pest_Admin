import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
// import PropTypes from "prop-types";

const Mudule = ({ modalTitle, modalContent, show, onClose, onConfirm }) => {
  const handleClose = () => {
    if (onClose) onClose();
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };

  return (
    <>
      <Modal style={{marginTop:'90px'}} className="modal" show={show} onHide={handleClose}>
        <Modal.Header className="modalhead"  closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalbody" >{modalContent}</Modal.Body>
        <Modal.Footer className="modalbody">
          <button
            type="button"
            onClick={handleClose}
            className="btn btn-outline-secondary"
          >
            Cancel
          </button>
          <Button id='cbt' className="btn-primary " onClick={handleConfirm}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Mudule;
