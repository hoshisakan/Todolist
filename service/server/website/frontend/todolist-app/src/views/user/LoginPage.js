import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Form, Button, Row, Col, Card, Container } from 'react-bootstrap'
import { setToken } from '../../auth.js'
import { apiUserLogin } from '../../api.js'
import '../../assets/css/login_page_style.css'

export default function LoginPage() {
    const history = useHistory()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const validateForm = () => {
        return username.length === 0 || password.length === 0
    }

    const handleLoginSubmit = () => {
        setErrorMessage('')
        let data = JSON.stringify({
            username: username,
            password: password,
        })
        apiUserLogin(data)
            .then((res) => {
                let access_token = res.data['access']
                let refresh_token = res.data['refresh']
                setToken(access_token, refresh_token)
                setDisplayErrorMessage(false)
                history.push('/user/todo/book')
            })
            .catch((err) => {
                setDisplayErrorMessage(true)
                setErrorMessage('Login Failed')
            })
    }

    return (
        <div>
            <Container>
                <Row>
                    <Col md={12}>
                        <Card border="light" bg="light" text="black" className="card-mt-1">
                            <Form>
                                <Card.Header>User Login</Card.Header>
                                <Card.Body>
                                    <Form.Group controlId="formUsrname" className="align-items-left-2">
                                        <Form.Label className="form-horizontal.control-label">Usrename</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Username"
                                            onChange={handleUsernameChange}
                                            value={username}
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formPassword" className="align-items-left-2">
                                        <Form.Label className="form-horizontal.control-label">Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            onChange={handlePasswordChange}
                                            value={password}
                                        />
                                    </Form.Group>
                                    {displayErrorMessage ? (
                                        <div className="field-error-remind">{errorMessage}</div>
                                    ) : null}
                                    <div className="btn-mt-1">
                                        <Button
                                            variant="primary"
                                            block
                                            onClick={handleLoginSubmit}
                                            disabled={validateForm()}
                                        >
                                            Login
                                        </Button>
                                    </div>
                                </Card.Body>
                                <Card.Footer>
                                    <Row className="link-mt-1">
                                        <Col md={6}>
                                            <Link className="reigster-link" to="/session/register">
                                                <Button variant="success">Register</Button>
                                            </Link>
                                        </Col>
                                        <Col md={6}>
                                            <Link to="/session/forget-password">Forget your password?</Link>
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
