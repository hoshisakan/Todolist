import React, { useState, useCallback, useEffect } from 'react'
import { Button, Card, Modal, Form, Row, Col } from 'react-bootstrap'
import '../../assets/css/form_level_style.css'
import { apiDeleteBookTodo, apiEditBookTodo, apiCheckBookTodo } from '../../api.js'

export default function TodoBook(props) {
    const {
        setRequestUpdate,
        id,
        title,
        author,
        price,
        isRead,
        nationality,
        url,
        dueDate,
        // daysSinceCreated,
        lastModifyDate,
        createdAt,
        dueDays,
        willDueDays,
        currentWindowSize,
        cardColor
    } = props
    const [updateId, setId] = useState(id)
    const [updateTitle, setTitle] = useState(title)
    const [updateAuthor, setAuthor] = useState(author)
    const [updatePrice, setPrice] = useState(price)
    const [updateNationality, setNationality] = useState(nationality)
    const [updateUrl, setURL] = useState(url)
    const [updateDueDate, setDueDate] = useState(dueDate)
    const [editEnabled, setEditEnabled] = useState(false)
    const [displayDeleteConfirm, setDisplayDeleteConfirm] = useState(false)
    const [requestEditId, setRequestEditId] = useState(0)
    const [displayEditForm, setDisplayEditForm] = useState(false)
    const [showTitleFaildMsg, setShowTitleFaildMsg] = useState(false)
    const [showUrlFailedMsg, setShowUrlFailedMsg] = useState(false)
    const [titleFailedMsg, setTitleFailedMsg] = useState('')
    const [urlFailedMsg, setUrlFailedMsg] = useState('')
    const [cardWidth, setCardWidth] = useState('33rem')
    const [cardMinHeight, setCardMinHeight] = useState('45vh')
    const [lastTimeWindowSize, setLastTimeWindowSize] = useState({
        x: 0,
        y: 0,
    })
    const [renderCardColor] = useState(cardColor)
    const [checkUpdateAllow, setCheckUpdateAllow] = useState(false)


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
                    setRequestUpdate(1)
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
                    } else if (error_msg['is_title_exists'] === false && error_msg['is_url_exists']) {
                        setUrlFailedMsg('The url has been exists')
                        setShowTitleFaildMsg(false)
                        setShowUrlFailedMsg(true)
                    }
                }
                setRequestUpdate(-1)
            })
        setCheckUpdateAllow(true)
    }

    const handleUpdateCancelEvent = () => {
        setRequestUpdate(1)
        setCheckUpdateAllow(true)
        setDisplayEditForm(false)
        setEditEnabled(false)
    }

    const handleDeleteItemEvent = async () => {
        await apiDeleteBookTodo(id)
            .then((res) => {
                setRequestUpdate(1)
            })
            .catch((err) => {
                // console.error(err)
                setRequestUpdate(-1)
            })
    }

    const handleCancelDeleteItemEvent = () => {
        setDisplayDeleteConfirm(false)
    }

    const displayDeleteItemConfirm = async () => {
        setDisplayDeleteConfirm(true)
    }


    const changeEditCard = () => {
        setCheckUpdateAllow(true)
        setRequestEditId(updateId)
        setEditEnabled(true)
        setDisplayEditForm(true)
    }

    const checkTodoCard = async () => {
        await apiCheckBookTodo(id, true)
            .then((res) => {
                setRequestUpdate(1)
            })
            .catch((err) => {
                // console.error(err)
                setRequestUpdate(-1)
            })
    }

    const checkPropsUpdate = useCallback(() => {
        const updatePropsData = () => {
            setId(id)
            setTitle(title)
            setAuthor(author)
            setPrice(price)
            setNationality(nationality)
            setURL(url)
            setDueDate(dueDate)
            // setDaysSinceCreated(daysSinceCreated)
            setCheckUpdateAllow(false)
        }
        if (checkUpdateAllow) {
            updatePropsData()
        }
    // }, [author, checkUpdateAllow, daysSinceCreated, dueDate, id, nationality, price, title, url])
    }, [author, checkUpdateAllow, dueDate, id, nationality, price, title, url])

    const updateWindowSize = useCallback(() => {
        if (lastTimeWindowSize.x !== currentWindowSize.x) {
            if (currentWindowSize.x < 1000) {
                // setCardWidth('24rem')
                setCardWidth('23rem')
                setCardMinHeight('45vh')
            } else if (currentWindowSize.x >= 1000 && currentWindowSize.x <= 1600) {
                // setCardWidth('28rem')
                setCardWidth('33rem')
                setCardMinHeight('43vh')
            } else {
                // setCardWidth('28rem')
                setCardWidth('40rem')
                // setCardMinHeight('35vh')
                setCardMinHeight('33vh')
            }
            setLastTimeWindowSize(currentWindowSize)
            // setRenderCardColor(cardColor) // 當偵測到視窗尺寸有變化時，則會重新渲染卡片的顏色
        }
    // }, [cardColor, currentWindowSize, lastTimeWindowSize])
    }, [currentWindowSize, lastTimeWindowSize.x])

    useEffect(() => {
        checkPropsUpdate()
        updateWindowSize()
    }, [checkPropsUpdate, updateWindowSize])

    return (
        <div>
            <div>
                <Modal show={displayDeleteConfirm} backdrop="static" keyboard={false}>
                    <Modal.Header style={{ background: renderCardColor, color: 'white' }}>
                        <Modal.Title>
                            <p>Confirm action delete</p>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete this item <span style={{ fontWeight: 'bold' }}> {title}</span> ?
                    </Modal.Body>
                    <Modal.Footer style={{ borderColor: renderCardColor }}>
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
                                <Card style={{ borderColor: renderCardColor, width: cardWidth }}>
                                    <Card.Header
                                        variant="primary"
                                        className="book-todo-card-header"
                                        style={{ background: renderCardColor }}
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
                    <div className="book-todo-root-1" style={{ minHeight: cardMinHeight }}>
                        <Card style={{ borderColor: renderCardColor, width: cardWidth }}>
                            <Card.Header
                                variant="primary"
                                className="book-todo-card-header"
                                style={{ background: renderCardColor }}
                            >
                                {title}
                            </Card.Header>
                            <Card.Body>
                                <Card.Title>
                                { dueDays > 0 ? (<p>Due Date: {dueDate} ( Due {dueDays} days )</p>) : <p>Due Date: {dueDate} ( Will due {willDueDays} days )</p> }
                                    
                                </Card.Title>
                                <Card.Text as="div" style={{ fontSize: '17px' }}>
                                    Created At: {createdAt}
                                    <br />
                                    {nationality} - {author} - US${price} - <a href={url}>Link</a>
                                    <br />
                                    {isRead ? 'Read' : 'Unread'}
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
                            <Card.Footer style={{ borderColor: renderCardColor }}>
                                <div style={{ fontWeight: 'bold' }}>Last Modified: {lastModifyDate}</div>
                            </Card.Footer>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
