import React, { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "shards-react";

const CustomModal = ({ open, submit,closemodal, children,item, title }) =>  {

  const toggle = (type) => {
    if(type){
      submit(item)
    }else {
      closemodal()
    }
  }
  return (
    <div>
      <Modal open={open} toggle={toggle} onClick={toggle}>
        <ModalHeader>{ title }</ModalHeader>
        <ModalBody>{ children }</ModalBody>
        <Button theme="danger" className="btn-block custom-btn" onClick={() => toggle('click')}>Submit</Button>
      </Modal>
    </div>
  );
}

export default CustomModal;
