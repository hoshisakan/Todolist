import React, { useState, useCallback, useEffect } from 'react'
import { Button, Card, Modal, Form, Row, Col } from 'react-bootstrap'
import '../../assets/css/form_level_style.css'
import { apiDeleteBookTodo, apiEditBookTodo, apiCheckBookTodo } from '../../api.js'
import { randomColor } from '../../components/Cards/color'

export default function TodoBook(props) {
    // eslint-disable-next-line no-unused-vars
    const {
        // eslint-disable-next-line no-unused-vars
        setRequestUpdate,
        id,
        title,
        author,
        price,
        isRead,
        nationality,
        url,
        dueDate,
        daysSinceCreated,
        lastModifyDate,
        createdAt,
    } = props
    const [updateId, setId] = useState(id)
    const [updateTitle, setTitle] = useState(title)
    const [updateAuthor, setAuthor] = useState(author)
    const [updatePrice, setPrice] = useState(price)
    const [updateIsRead, setIsRead] = useState(isRead)
    const [updateNationality, setNationality] = useState(nationality)
    const [updateUrl, setURL] = useState(url)
    const [updateDueDate, setDueDate] = useState(dueDate)
    const [readLastModifyDate, setLastModifyDate] = useState(lastModifyDate)
    const [readCreatedAt, setCreatedAt] = useState(createdAt)
    // eslint-disable-next-line no-unused-vars
    const [readDaysSinceCreated, setDaysSinceCreated] = useState(daysSinceCreated)
    const [editEnabled, setEditEnabled] = useState(false)
    const [cardColor, setCardColor] = useState('')
    const [displayDeleteConfirm, setDisplayDeleteConfirm] = useState(false)
    const [requestEditId, setRequestEditId] = useState(0)
    const [displayEditForm, setDisplayEditForm] = useState(false)
    const [showTitleFaildMsg, setShowTitleFaildMsg] = useState(false)
    const [showUrlFailedMsg, setShowUrlFailedMsg] = useState(false)
    const [titleFailedMsg, setTitleFailedMsg] = useState('')
    const [urlFailedMsg, setUrlFailedMsg] = useState('')

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

    const clearErrorMsg = () => {
        setTitleFailedMsg('')
        setUrlFailedMsg('')
    }

    const handleUpdateEvent = async () => {
        clearErrorMsg()
        let data = {
            title: updateTitle,
            author: updateAuthor,
            price: updatePrice,
            nationality: updateNationality,
            url: updateUrl,
            due_date: updateDueDate,
        }
        await apiEditBookTodo(id, data)
            .then((res) => {
                if (res.data['is_updated']) {
                    props.setRequestUpdate(1)
                    setDisplayEditForm(false)
                    setEditEnabled(false)
                }
            })
            .catch((err) => {
                // console.error(err.response.data.error)
                let error_status_code = err.response.status
                let error_msg = err.response.data.error
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

    const handleUpdateCancelEvent = () => {
        props.setRequestUpdate(1)
        setDisplayEditForm(false)
        setEditEnabled(false)
    }

    const handleDeleteItemEvent = async () => {
        await apiDeleteBookTodo(id)
            .then((res) => {
                props.setRequestUpdate(1)
            })
            .catch((err) => {
                // console.error(err)
                props.setRequestUpdate(-1)
            })
    }

    const handleCancelDeleteItemEvent = () => {
        setDisplayDeleteConfirm(false)
    }

    const displayDeleteItemConfirm = async () => {
        setDisplayDeleteConfirm(true)
    }

    const changeEditCard = () => {
        setRequestEditId(updateId)
        setEditEnabled(true)
        setDisplayEditForm(true)
    }

    const checkTodoCard = async () => {
        await apiCheckBookTodo(id, true)
            .then((res) => {
                props.setRequestUpdate(1)
            })
            .catch((err) => {
                // console.error(err)
                props.setRequestUpdate(-1)
            })
    }

    const updateCardColor = () => {
        setCardColor(randomColor())
    }

    const checkPropsUpdate = useCallback(() => {
        updateCardColor()
        setId(id)
        setTitle(title)
        setAuthor(author)
        setPrice(price)
        setIsRead(isRead)
        setNationality(nationality)
        setURL(url)
        setDueDate(dueDate)
        setLastModifyDate(lastModifyDate)
        setCreatedAt(createdAt)
        setDaysSinceCreated(daysSinceCreated)
    }, [author, createdAt, daysSinceCreated, dueDate, id, isRead, lastModifyDate, nationality, price, title, url])

    useEffect(() => {
        checkPropsUpdate()
    }, [checkPropsUpdate])

    return (
        <div>
            <div>
                <Modal show={displayDeleteConfirm} backdrop="static" keyboard={false}>
                    <Modal.Header style={{ background: cardColor, color: 'white' }}>
                        <Modal.Title>
                            <p>Confirm action delete</p>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this item <span style={{ fontWeight: 'bold' }}> {title}</span> ?
                    </Modal.Body>
                    <Modal.Footer style={{ borderColor: cardColor }}>
                        <Button variant="primary" onClick={handleDeleteItemEvent}>
                            Yes
                        </Button>
                        <Button variant="secondary" onClick={handleCancelDeleteItemEvent}>
                            No
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <div>
                {editEnabled && id === requestEditId ? (
                    <div>
                        {displayEditForm ? (
                            <div className="book-todo-root-1">
                                <Card style={{ borderColor: cardColor }}>
                                    <Card.Header
                                        variant="primary"
                                        className="book-todo-card-header"
                                        style={{ background: cardColor }}
                                    >
                                        Edit {title}
                                    </Card.Header>
                                    <Card.Body>
                                        <Form.Group controlId="formTitle" className="align-items-left-2">
                                            <Form.Label className="form-horizontal.control-label">Title</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                placeholder="Title"
                                                onChange={handleTitleChange}
                                                value={updateTitle}
                                            />
                                            {showTitleFaildMsg ? (
                                                <p className="field-error-remind">{titleFailedMsg}</p>
                                            ) : null}
                                        </Form.Group>
                                        <Row>
                                            <Form.Group as={Col} controlId="formAuthor" className="align-items-left-2">
                                                <Form.Label className="form-horizontal.control-label">
                                                    Author
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Author"
                                                    onChange={handleAuthorChange}
                                                    value={updateAuthor}
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="formPrice" className="align-items-left-2">
                                                <Form.Label className="form-horizontal.control-label">
                                                    Nationality
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Nationality"
                                                    onChange={handleNationalityChange}
                                                    value={updateNationality}
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
                                                value={updatePrice}
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="formURL" className="align-items-left-2">
                                            <Form.Label className="form-horizontal.control-label">URL</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="URL"
                                                onChange={handleURLChange}
                                                value={updateUrl}
                                            />
                                            {showUrlFailedMsg ? (
                                                <p className="field-error-remind">{urlFailedMsg}</p>
                                            ) : null}
                                        </Form.Group>
                                        <Form.Group controlId="formDueDate" className="align-items-left-2">
                                            <Form.Label className="form-horizontal.control-label">Due Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                placeholder="Due Date"
                                                onChange={handleDueDateChange}
                                                value={updateDueDate}
                                                timeFormat="YYYY-MM-DD"
                                            />
                                        </Form.Group>
                                        <div>
                                            <Button
                                                className="book-todo-btn-2"
                                                variant="primary"
                                                onClick={handleUpdateEvent}
                                            >
                                                Save changes
                                            </Button>
                                            <Button
                                                className="book-todo-btn-2"
                                                variant="danger"
                                                onClick={handleUpdateCancelEvent}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <div className="book-todo-root-1">
                        <Card style={{ borderColor: cardColor }}>
                            <Card.Header
                                variant="primary"
                                className="book-todo-card-header"
                                style={{ background: cardColor }}
                            >
                                {updateTitle}
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>Due Date: {updateDueDate}</Card.Title>
                                <Card.Text as="div" style={{ fontSize: '17px' }}>
                                    Created At: {readCreatedAt}
                                    <br />
                                    {updateNationality} - {updateAuthor} - US${updatePrice} -{' '}
                                    <a href={updateUrl}>Link</a>
                                    <br />
                                    {updateIsRead ? 'Read' : 'Unread'}
                                    <br />
                                </Card.Text>

                                <div className="book-todo-btn-group-1">
                                    <Button className="book-todo-btn-1" variant="success" onClick={checkTodoCard}>
                                        Complete
                                    </Button>
                                    <Button className="book-todo-btn-1" variant="primary" onClick={changeEditCard}>
                                        Edit
                                    </Button>
                                    <Button
                                        className="book-todo-btn-1"
                                        variant="danger"
                                        onClick={displayDeleteItemConfirm}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card.Body>
                            <Card.Footer style={{ borderColor: cardColor }}>
                                <div style={{ fontWeight: 'bold' }}>Last Modified: {readLastModifyDate}</div>
                            </Card.Footer>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
