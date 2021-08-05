import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col, Card, Container, Alert } from 'react-bootstrap'
import { apiApplyResetPassword } from '../../api.js'

export default function ApplyResetPasswordPage(props) {
    const currentWindowSize = props.currentWindowSize === undefined ? '28rem' : props.currentWindowSize
    const [email, setEmail] = useState('')
    const [applySuccess, setApplySuccess] = useState(false)
    const [applyFailure, setApplyFailure] = useState(false)
    const [cardWidth, setCardWidth] = useState('28rem')
    const [cardBtnSpacing, setCardBtnSpacing] = useState('10.5rem')

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
                // console.error(err)
                setApplyFailure(true)
                setApplySuccess(false)
            })
    }

    useEffect(() => {
        if (currentWindowSize.x < 1000) {
            setCardWidth('23rem')
            setCardBtnSpacing('4.2rem')
        } else if (currentWindowSize.x >= 1000 && currentWindowSize.x <= 1600) {
            setCardWidth('27rem')
            setCardBtnSpacing('8.3rem')
        } else {
            setCardWidth('30rem')
            setCardBtnSpacing('10.6rem')
        }
    }, [currentWindowSize])

    return (
        <div>
            <Container>
                <Row>
                    <Col md={12}>
                        <Card style={{ width: cardWidth }} border="light" bg="light" text="black" className="card-mt-1">
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
                                    <span style={{ textAlign: 'left', marginRight: cardBtnSpacing }}>
                                        <Button variant="primary" onClick={handleApplySubmit} disabled={validateForm()}>
                                            Apply Reset Password
                                        </Button>
                                    </span>
                                    <span style={{ textAlign: 'right' }}>
                                        <Link to="/session/login">
                                            <Button variant="danger">Return</Button>
                                        </Link>
                                    </span>
                                    {/* <Row>
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
                                    </Row> */}
                                </Card.Footer>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
