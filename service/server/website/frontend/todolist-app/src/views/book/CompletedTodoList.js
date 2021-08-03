import React, { useState, useEffect } from 'react'
import { Button, Card } from 'react-bootstrap'
import '../../assets/css/form_level_style.css'
import { apiCheckBookTodo } from '../../api.js'
import { randomColor } from '../../components/Cards/color'

export default function TodoBook(props) {
    // eslint-disable-next-line no-unused-vars
    const {
        // eslint-disable-next-line no-unused-vars
        setRequestcompleted,
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
        currentWindowSize,
    } = props
    const cardColor = randomColor()
    const [cardWidth, setCardWidth] = useState('28rem')

    const revokeCompeltedItem = async () => {
        // alert(id)
        await apiCheckBookTodo(id, false)
            .then((res) => {
                props.setRequestUpdate(1)
            })
            .catch((err) => {
                console.error(err)
                props.setRequestUpdate(-1)
            })
    }

    useEffect(() => {
        if (currentWindowSize.x < 1000) {
            setCardWidth('24rem')
        } else if (currentWindowSize.x >= 1000) {
            setCardWidth('28rem')
        }
    }, [currentWindowSize])

    return (
        <div>
            <div className="book-todo-root-1">
                <Card style={{ borderColor: cardColor, width: cardWidth }}>
                    <Card.Header variant="primary" className="book-todo-card-header" style={{ background: cardColor }}>
                        {title}
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>Due Date: {dueDate}</Card.Title>
                        <Card.Text as="div" style={{ fontSize: '17px' }}>
                            Created At: {createdAt}
                            <br />
                            {nationality} - {author} - US${price} - <a href={url}>Link</a>
                            <br />
                            {isRead ? 'Read' : 'Unread'}
                            <br />
                        </Card.Text>
                        <div className="book-todo-btn-group-1">
                            <Button variant="danger" onClick={revokeCompeltedItem}>
                                Revoke
                            </Button>
                        </div>
                    </Card.Body>
                    <Card.Footer style={{ borderColor: cardColor }}>
                        <div style={{ fontWeight: 'bold' }}>Last Modified: {lastModifyDate}</div>
                    </Card.Footer>
                </Card>
            </div>
        </div>
    )
}
