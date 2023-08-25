import React, { useState, useEffect } from "react";
import { Row, Col, Modal, Button, Form } from "react-bootstrap";
import RoleBadge from "main/components/Profile/RoleBadge";
import { useCurrentUser } from "main/utils/currentUser";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import {  useBackendMutation } from "main/utils/useBackend";

const ProfilePage = () => {
    const { data: currentUser } = useCurrentUser();
    // Stryker disable all
    const [showModal, setShowModal] = useState(false);
    const [phone, setPhone] = useState(() => currentUser?.root?.user?.cellphone);
    const [newPhone, setNewPhone] = useState(() => currentUser?.root?.user?.cellphone);
    useEffect(() => {
        setPhone(currentUser?.root?.user?.cellphone);
        setNewPhone(currentUser?.root?.user?.cellphone);
    }, [currentUser]);        
    // Stryker restore all

    // Stryker disable next-line all
    const objectToAxiosPutParams = () => ({
        // Stryker disable all
        url: "/api/userprofile/updatecellphone",
        method: "PUT",
        params: {
            cellphone: newPhone
        }
        // Stryker restore all
      });

      const onSuccess = (item) => {
        console.log('User Updated:', item);
        // TODO: refresh currentUser cache instead of forcing a full page reload
        window.location.reload();
        handleClose();
      }

      const mutation = useBackendMutation(
        objectToAxiosPutParams,
        // Stryker disable next-line all
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/currentUser`]
      );
      
    //const { isSuccess } = mutation

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const handleSave = async () => {

        mutation.mutate();
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
                        <Form.Label htmlFor="phoneNumber">Phone Number</Form.Label>
                        <Form.Control 
                            id="phoneNumber"
                            type="text" 
                            value={newPhone} 
                            onChange={(e) => setNewPhone(e.target.value)} 
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
