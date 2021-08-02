import React, { useState } from 'react'
import '../../assets/css/form_level_style.css'
import { apiAddBookTodo } from '../../api.js'
import { Button, Card, Form, Row, Col } from 'react-bootstrap'
import { randomColor } from '../../components/Cards/color'

export default function AddTodo(props) {
    // eslint-disable-next-line no-unused-vars
    const { setRequestUpdate } = props
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [price, setPrice] = useState('')
    const [nationality, setNationality] = useState('')
    const [url, setURL] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [showTitleFaildMsg, setShowTitleFaildMsg] = useState(false)
    const [showUrlFailedMsg, setShowUrlFailedMsg] = useState(false)
    const [titleFailedMsg, setTitleFailedMsg] = useState('')
    const [urlFailedMsg, setUrlFailedMsg] = useState('')
    const cardColor = randomColor()

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
    }

    const handleAuthorChange = (e) => {
        setAuthor(e.target.value)
    }

    const handlePriceChange = (e) => {
        setPrice(e.target.value)
    }

    const handleNationalityChange = (e) => {
        setNationality(e.target.value)
    }
    const handleURLChange = (e) => {
        setURL(e.target.value)
    }
    const handleDueDateChange = (e) => {
        setDueDate(e.target.value)
    }

    const validateSubmitForm = () => {
        return (
            title.length > 0 &&
            author.length > 0 &&
            price.length > 0 &&
            nationality.length > 0 &&
            url.length > 0 &&
            dueDate.length > 0
        )
    }

    const clearForm = () => {
        setTitle('')
        setAuthor('')
        setPrice('')
        setNationality('')
        setURL('')
        setDueDate('')
    }

    const clearErrorMsg = () => {
        setTitleFailedMsg('')
        setUrlFailedMsg('')
    }

    const handleAddEvent = async () => {
        clearErrorMsg()
        let data = {
            title: title,
            author: author,
            price: price,
            // is_read: isRead,
            nationality: nationality,
            url: url,
            due_date: dueDate,
        }
        await apiAddBookTodo(data)
            .then((res) => {
                if (res.data['is_writed']) {
                    props.setRequestUpdate(1)
                    clearForm()
                }
            })
            .catch((err) => {
                // console.error(err)
                let error_status_code = err.response.status
                let error_msg = err.response.data.error
                console.error(error_status_code, error_msg)
                if (error_status_code === 400) {
                    if (error_msg['is_title_exists'] && error_msg['is_url_exists']) {
                        setTitleFailedMsg('The title has been exists')
                        setUrlFailedMsg('The url has been exists')
                        setShowTitleFaildMsg(true)
                        setShowUrlFailedMsg(true)
                    } else if (error_msg['is_title_exists'] && error_msg['is_url_exists'] === false) {
                        setTitleFailedMsg('The title has been exists')
                        setShowTitleFaildMsg(true)
                        setShowUrlFailedMsg(false)
                    } else {
                        setUrlFailedMsg('The url has been exists')
                        setShowTitleFaildMsg(false)
                        setShowUrlFailedMsg(true)
                    }
                }
                props.setRequestUpdate(-1)
            })
    }

    const handleCancelEvent = () => {
        clearForm()
        props.setRequestUpdate(0)
    }

    return (
        <div>
            <div className="book-todo-root-1">
                <Card style={{ borderColor: cardColor }}>
                    <Card.Header variant="primary" className="book-todo-card-header" style={{ background: cardColor }}>
                        Add Todo
                    </Card.Header>
                    <Card.Body>
                        <Form.Group controlId="formTitle" className="align-items-left-2">
                            <Form.Label className="form-horizontal.control-label">Title</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Title"
                                onChange={handleTitleChange}
                                value={title}
                            />
                            {showTitleFaildMsg ? <p className="field-error-remind">{titleFailedMsg}</p> : null}
                        </Form.Group>
                        <Row>
                            <Form.Group as={Col} controlId="formAuthor" className="align-items-left-2">
                                <Form.Label className="form-horizontal.control-label">Author</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Author"
                                    onChange={handleAuthorChange}
                                    value={author}
                                />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formPrice" className="align-items-left-2">
                                <Form.Label className="form-horizontal.control-label">Nationality</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Nationality"
                                    onChange={handleNationalityChange}
                                    value={nationality}
                                />
                            </Form.Group>
                        </Row>
                        <Form.Group controlId="formPrice" className="align-items-left-2">
                            <Form.Label className="form-horizontal.control-label">Price</Form.Label>
                            <Form.Control
                                type="number"
                                step="any"
                                placeholder="Price"
                                onChange={handlePriceChange}
                                value={price}
                            />
                        </Form.Group>
                        <Form.Group controlId="formURL" className="align-items-left-2">
                            <Form.Label className="form-horizontal.control-label">URL</Form.Label>
                            <Form.Control type="text" placeholder="URL" onChange={handleURLChange} value={url} />
                            {showUrlFailedMsg ? <p className="field-error-remind">{urlFailedMsg}</p> : null}
                        </Form.Group>
                        <Form.Group controlId="formDueDate" className="align-items-left-2">
                            <Form.Label className="form-horizontal.control-label">Due Date</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Due Date"
                                onChange={handleDueDateChange}
                                value={dueDate}
                                timeFormat="YYYY-MM-DD"
                            />
                        </Form.Group>
                        <div>
                            <Button
                                className="book-todo-btn-2"
                                variant="primary"
                                onClick={handleAddEvent}
                                disabled={!validateSubmitForm()}
                            >
                                Save changes
                            </Button>
                            <Button className="book-todo-btn-2" variant="danger" onClick={handleCancelEvent}>
                                Cancel
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </div>
    )
}
