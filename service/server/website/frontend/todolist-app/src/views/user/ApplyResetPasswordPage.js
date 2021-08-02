import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Card, Container, Alert } from 'react-bootstrap'
import { apiApplyResetPassword } from '../../api.js'

export default function ApplyResetPasswordPage() {
    const [email, setEmail] = useState('')
    const [applySuccess, setApplySuccess] = useState(false)
    const [applyFailure, setApplyFailure] = useState(false)

    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const validateForm = () => {
        return email.length === 0
    }

    const handleApplySubmit = () => {
        let data = {
            email: email,
        }
        apiApplyResetPassword(data)
            .then((res) => {
                if (res.data['apply_reset_success']) {
                    setApplyFailure(false)
                    setApplySuccess(true)
                }
            })
            .catch((err) => {
                console.error(err)
                setApplyFailure(true)
                setApplySuccess(false)
            })
    }

    return (
        <div>
            <Container>
                <Row>
                    <Col md={12}>
                        <Card border="light" bg="light" text="black" className="card-mt-1">
                            <Form>
                                <Card.Header>Apply Reset Password</Card.Header>
                                <Card.Body>
                                    {applySuccess ? (
                                        <Alert variant="success">
                                            <Alert.Heading>Apply Success</Alert.Heading>
                                            <p className="mb-0">
                                                Please go to your mailbox to receive the reset password email
                                            </p>
                                        </Alert>
                                    ) : null}
                                    {applyFailure ? (
                                        <Alert variant="danger">
                                            <Alert.Heading>Apply Failed</Alert.Heading>
                                            <p className="mb-0">
                                                Please check field whether or enter duplicate username or email
                                            </p>
                                        </Alert>
                                    ) : null}
                                    <Form.Group controlId="formEmail" className="align-items-left-2">
                                        <Form.Label className="form-horizontal.control-label">Email</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Email"
                                            onChange={handleEmailChange}
                                            value={email}
                                        />
                                    </Form.Group>
                                </Card.Body>
                                <Card.Footer>
                                    <Row>
                                        <Col md={9}>
                                            <Button
                                                variant="primary"
                                                onClick={handleApplySubmit}
                                                disabled={validateForm()}
                                            >
                                                Apply Reset Password
                                            </Button>
                                        </Col>
                                        <Col md={3}>
                                            <Link to="/session/login">
                                                <Button variant="danger">Return</Button>
                                            </Link>
                                        </Col>
                                    </Row>
                                </Card.Footer>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
