import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { Form, Badge } from 'react-bootstrap';

const CustomBroadcast = (props) => {
    return (
        <>
        <Modal
            show={props.show}
            onHide={props.handleClose}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header>
            <Modal.Title>Custom Message</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form.Label>Recipient Name</Form.Label>
            <Form.Control type="text" placeholder={props.orderName} readOnly />
            <br></br>
            <InputGroup>
                <FormControl as="textarea" aria-label="With textarea" placeholder="Write your custom message here"
                onChange = {props.onChangeCustomMessage}
                value= {props.CustomMessage}
                />
            </InputGroup>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={props.sendCustomMessage}>
                Send Message
                </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}

export default CustomBroadcast;