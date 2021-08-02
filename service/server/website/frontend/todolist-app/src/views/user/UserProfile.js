import React, { useState, useCallback, useEffect } from 'react'
import { Form, Row, Col, Card, Container } from 'react-bootstrap'
import '../../assets/css/form_level_style.css'
import { apiUpdateUserProfile } from '../../api.js'

export default function UserProfile() {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')

    const updateUserProfile = useCallback(() => {
        const fetchUserProfile = async () => {
            apiUpdateUserProfile()
                .then((res) => {
                    let res_data = res.data.info
                    setUsername(res_data['user'])
                    setEmail(res_data['email'])
                })
                .catch((err) => {
                    console.error(err.response.data)
                })
        }
        fetchUserProfile()
    }, [])

    useEffect(() => {
        updateUserProfile()
    }, [updateUserProfile])

    return (
        <div className="card-root">
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <Card border="dark" bg="light" text="black" className="card-mt-1">
                            <Form>
                                <Card.Header>User Profile</Card.Header>

                                <Card.Body>
                                    <Form.Group controlId="formUsrname" className="align-items-left-2">
                                        <Form.Label className="form-horizontal.control-label">Usrename</Form.Label>
                                        <Form.Control type="text" placeholder="Username" value={username} disabled />
                                    </Form.Group>
                                    <Form.Group controlId="formEmail" className="align-items-left-2">
                                        <Form.Label className="form-horizontal.control-label">Email</Form.Label>
                                        <Form.Control type="email" placeholder="Email" value={email} disabled />
                                    </Form.Group>
                                </Card.Body>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
