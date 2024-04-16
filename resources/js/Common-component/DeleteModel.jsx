import React, { Fragment } from 'react'
import { Button, CardText, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

function DeleteModel({ title, body, deleteModel, setDeleteModel, deleteButton, yes='Delete', no='Cancel', ifNo=true }) {
  return (
    <Fragment>
        <Modal isOpen={deleteModel} toggle={() => setDeleteModel(!deleteModel)} className={`modal-dialog-centered modal-md`}>
            <ModalHeader className={`bg-white mt-1`}  style={{border: 'none'}} toggle={() => setDeleteModel(!deleteModel)}>
                <CardText>{title}</CardText>
            </ModalHeader>
            <ModalBody >
                <CardText className=''>{body}</CardText>
            </ModalBody>
            <ModalFooter style={{border: 'none'}}>
                {ifNo && <Button color='success' onClick={() => setDeleteModel(!deleteModel)}>{no}</Button>}
                <Button color='danger' onClick={() => deleteButton()}>{yes}</Button>
            </ModalFooter>
        </Modal>
    </Fragment>
  )
}

export default DeleteModel