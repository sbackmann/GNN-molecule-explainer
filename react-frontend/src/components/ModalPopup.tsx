import React, { useEffect, useState } from 'react';
import { postEmbeddings } from "../router/resources/data";
import Modal from 'react-modal';
import { EmbeddingArray, EmbeddingPoint } from "../types/data";
import Button from 'react-bootstrap/Button';
import ScatterPlot from "./ScatterPlot";

type ModalPopupProps = {
  triggerButton: JSX.Element;
  modalTitle: string;
};


const ModalPopup: React.FC<ModalPopupProps> = ({ triggerButton, modalTitle }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [embeddingData, setEmbeddingData] = useState<EmbeddingArray>();

  useEffect(() => {
    postEmbeddings().then((embeddingData) => {
      setEmbeddingData(embeddingData);
    });
  }, []);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  return (
    <>
      <Button variant="primary" onClick={openModal}>{triggerButton}</Button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="Modal"
        overlayClassName="Overlay"
        ariaHideApp={false}
      >
        <Button variant="primary" onClick={closeModal} className="CloseButton">
          X
        </Button>
        <h2>{modalTitle}</h2>
        <ScatterPlot width={800} height={400} data={embeddingData} />
      </Modal>
    </>
  );
};

export default ModalPopup;
