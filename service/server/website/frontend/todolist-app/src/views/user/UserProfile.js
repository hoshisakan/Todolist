import React, { useState, useCallback, useEffect } from 'react'
import { Form, Card, Container } from 'react-bootstrap'
import '../../assets/css/form_level_style.css'
import { apiUpdateUserProfile } from '../../api.js'

export default function UserProfile(props) {
    const currentWindowSize = props.currentWindowSize === undefined ? '28rem' : props.currentWindowSize
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [cardWidth, setCardWidth] = useState('28rem')

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
        if (currentWindowSize.x < 1000) {
            setCardWidth('24rem')
        } else if (currentWindowSize.x >= 1000) {
            setCardWidth('30rem')
        }
    }, [updateUserProfile, currentWindowSize])

    return (
        <div>
            <div className="card-root">
                <Container fluid>
                    <Card
                        style={{ width: cardWidth, height: '16rem' }}
                        border="dark"
                        bg="light"
                        text="black"
                        className="card-mt-1"
                    >
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
                </Container>
            </div>
        </div>
    )
}
