import React, { useState } from "react";
import { Row, Col, Modal, Button, Form } from "react-bootstrap";
import RoleBadge from "main/components/Profile/RoleBadge";
import { useCurrentUser } from "main/utils/currentUser";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";

const ProfilePage = () => {

    const { data: currentUser } = useCurrentUser();
    const [showModal, setShowModal] = useState(false);
    const [phone, setPhone] = useState(currentUser?.root?.user?.phone || '');

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const handleSave = async () => {
        const response = await fetch('/api/userprofile/updatecellphone', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                cellphone: phone
            })
        });
    
        if (response.ok) {
            const result = await response.json();
            console.log(result);
            setShowModal(false);
        } else {
            console.error('Failed to update cellphone number');
        }
    };    

    if (!currentUser.loggedIn) {
        return <p>Not logged in.</p>;
    }

    const { email, pictureUrl, fullName } = currentUser.root.user;
    return (
        <BasicLayout>
            <Row className="align-items-center profile-header mb-5 text-center text-md-left">
                <Col md={2}>
                    <img
                        src={pictureUrl}
                        alt="Profile"
                        className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                    />
                </Col>
                <Col md>
                    <h2>{fullName}</h2>
                    <p className="lead text-muted">{email}</p>
                    <p>
                        Cellphone No.: {phone} 
                        <Button className="ml-3" onClick={handleShow}>Edit</Button>
                    </p>
                    <RoleBadge role={"ROLE_USER"} currentUser={currentUser}/>
                    <RoleBadge role={"ROLE_MEMBER"} currentUser={currentUser}/>
                    <RoleBadge role={"ROLE_ADMIN"} currentUser={currentUser}/>
                    <RoleBadge role={"ROLE_DRIVER"} currentUser={currentUser}/>
                    <RoleBadge role={"ROLE_RIDER"} currentUser={currentUser}/>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Cell Phone Number</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control 
                            type="text" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            placeholder="Enter new phone number"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </BasicLayout>
    );
};

export default ProfilePage;
