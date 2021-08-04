import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Form, Button, Row, Col, Card, Container } from 'react-bootstrap'
import { setToken } from '../../auth.js'
import { apiUserLogin } from '../../api.js'
import '../../assets/css/login_page_style.css'

export default function LoginPage(props) {
    const currentWindowSize = props.currentWindowSize === undefined ? '28rem' : props.currentWindowSize
    const history = useHistory()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [cardWidth, setCardWidth] = useState('28rem')
    const [cardBtnSpacing, setCardBtnSpacing] = useState('10.5rem')

    const handleUsernameChange = (e) => {
        setUsername(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

    const validateForm = () => {
        return username.length === 0 || password.length === 0
    }

    const handleLoginSubmit = (e) => {
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
                // let error_status_code = err.response.status
                // let error_msg = err.response.data.error
                // alert(`${error_status_code}, ${error_msg}`)
                setDisplayErrorMessage(true)
                setErrorMessage('Login Failed')
            })
    }

    useEffect(() => {
        if (currentWindowSize.x < 1000) {
            setCardWidth('23rem')
            setCardBtnSpacing('4.5rem')
        } else if (currentWindowSize.x >= 1000) {
            setCardWidth('30rem')
            setCardBtnSpacing('12.0rem')
        }
    }, [currentWindowSize])

    return (
        <div>
            <Container>
                <Row>
                    <Col md={12}>
                        <Card style={{ width: cardWidth }} border="light" bg="light" text="black" className="card-mt-1">
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
                                    <span style={{ textAlign: 'left', marginRight: cardBtnSpacing }}>
                                        <Link to="/session/register">
                                            <Button variant="success">Register</Button>
                                        </Link>
                                    </span>

                                    <span style={{ textAlign: 'right' }}>
                                        <Link to="/session/forget-password">Forget your password?</Link>
                                    </span>
                                </Card.Footer>
                            </Form>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
