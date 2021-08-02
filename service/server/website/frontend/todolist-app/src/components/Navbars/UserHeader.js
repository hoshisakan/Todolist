import React from 'react'
import { Link } from 'react-router-dom'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'

export default function UserHeader(props) {
    const username = props.username === undefined ? null : props.username

    return (
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
            <Container fluid>
                {/* <Navbar.Brand as={Link} to="/">
                </Navbar.Brand> */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavDropdown title="Guide" id="basic-nav-dropdown">
                            <NavDropdown.Item eventKey="5" as={Link} to="/user/todo/book">
                                BookTodo
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item eventKey="6" as={Link} to="/user/completed/book">
                                CompelteTodo
                            </NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="User" id="basic-nav-dropdown">
                            <NavDropdown.Item eventKey="5" as={Link} to="/user/profile">
                                Profile
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            {/* <NavDropdown.Item eventKey="6" as={Link} to="/session/logout"> */}
                            <NavDropdown.Item eventKey="6" as={Link} to="/session/logout">
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav.Item className="ml-auto">
                        <Navbar.Text style={{ color: 'white' }}>Hi {username} !</Navbar.Text>
                    </Nav.Item>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
