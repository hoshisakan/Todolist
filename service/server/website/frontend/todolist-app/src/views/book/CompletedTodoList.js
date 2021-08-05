import React, { useState, useEffect } from 'react'
import { Button, Card } from 'react-bootstrap'
import '../../assets/css/form_level_style.css'
import { apiCheckBookTodo } from '../../api.js'

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
        dueDays,
        createdAt,
        currentWindowSize,
        cardColor,
    } = props
    const [cardWidth, setCardWidth] = useState('33rem')
    const [cardMinHeight, setCardMinHeight] = useState('45vh')
    const [lastTimeWindowSize, setLastTimeWindowSize] = useState({
        x: 0,
        y: 0,
    })
    const [renderCardColor] = useState(cardColor)

    const revokeCompeltedItem = async () => {
        await apiCheckBookTodo(id, false)
            .then((res) => {
                setRequestUpdate(1)
            })
            .catch((err) => {
                // console.error(err)
                setRequestUpdate(-1)
            })
    }

    useEffect(() => {
        if (lastTimeWindowSize.x !== currentWindowSize.x) {
            if (currentWindowSize.x < 1000) {
                // setCardWidth('24rem')
                setCardWidth('23rem')
                setCardMinHeight('45vh')
            } else if (currentWindowSize.x >= 1000 && currentWindowSize.x <= 1600) {
                // setCardWidth('28rem')
                setCardWidth('33rem')
                setCardMinHeight('42vh')
            } else if (currentWindowSize.x > 1600 && currentWindowSize.x < 1900){
                // setCardWidth('28rem')
                setCardWidth('40rem')
                setCardMinHeight('35vh')
            } else {
                setCardWidth('40rem')
                setCardMinHeight('33vh')
            }
            setLastTimeWindowSize(currentWindowSize)
            // setRenderCardColor(cardColor) // when detecting windows size changed, then re-render the card color
        }
    // }, [cardColor, currentWindowSize, lastTimeWindowSize])
    }, [currentWindowSize, lastTimeWindowSize])

    return (
        <div>
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
                        { dueDays > 0 ? (<p>Due date {dueDate} ( Due {dueDays} days )</p>) : <p>Not overdue</p> }
                        </Card.Title>
                        <Card.Text as="div" style={{ fontSize: '17px' }}>
                            Created At: {createdAt}
                            <br />
                            {nationality} - {author} - {price} - <a href={url}>Link</a>
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
                    <Card.Footer style={{ borderColor: renderCardColor }}>
                        <div style={{ fontWeight: 'bold' }}>Completed time: {lastModifyDate}</div>
                    </Card.Footer>
                </Card>
            </div>
        </div>
    )
}
