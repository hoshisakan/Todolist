import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'
// import { UserRouter, AuthRouter } from '../../route/routes.js'
import { UserRouter } from '../../route/routes.js'

export default function UserHeader(props) {
    const location = useLocation()
    // const allRoutes = UserRouter.concat(AuthRouter)
    const getBrandText = () => {
        for (let i = 0; i < UserRouter.length; i++) {
            if (location.pathname.indexOf(UserRouter[i].path_prefix + UserRouter[i].path) !== -1) {
                return UserRouter[i].name
            }
        }
    }
    const username = props.username === undefined ? null : props.username

    return (
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
            <Container fluid>
                <Navbar.Brand>
                    {getBrandText()}
                </Navbar.Brand>
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
                        <Navbar.Text style={{ color: 'white', fontSize: '18px'}}>
                            Signed in as: <span style= {{ fontWeight: 'bold' }}>{username}</span>
                        </Navbar.Text>
                    </Nav.Item>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
