import React, { useState, useEffect, useCallback } from 'react'
import { ButtonGroup, Dropdown, DropdownButton, Container } from 'react-bootstrap'
import '../../assets/css/form_level_style.css'
import { apiFetchBookTodo } from '../../api.js'
import CompletedTodoList from './CompletedTodoList'
import { orderByDropdownOptions } from './dropdown_options'
import { convertToLocalDate } from '../../components/Timer/dateFormat'
import useInterval from '../../components/Timer/useInterval'
import { getCurrentWindowSize } from '../../assets/js/getWindowSize.js'
import { randomColor } from '../../components/Cards/color'


export default function CompleteList(props) {
    const [currentWindowSize, setCurrentWindowSize] = useState(getCurrentWindowSize())
    const [todoListData, setTodoListData] = useState([])
    const [updateData, setUpdateData] = useState(1)
    const orderBy =
        sessionStorage.getItem('book_todo_sort') === undefined || sessionStorage.getItem('book_todo_sort') === null
            ? 'latest_created_first'
            : sessionStorage.getItem('book_todo_sort')

    const setBookTodoSort = (value) => {
        sessionStorage.setItem('book_todo_sort', value)
    }

    const handleOrderByChange = (eventKey, event) => {
        let orderBy = orderByDropdownOptions[eventKey].value
        setBookTodoSort(orderBy)
        setUpdateData(1)
    }

    const initPageData = useCallback(() => {
        const fetchTodoList = async () => {
            await apiFetchBookTodo(orderBy, true)
                .then((res) => {
                    const data = res.data.info
                    setTodoListData(data)
                    setUpdateData(-1)
                })
                .catch((err) => {
                    setUpdateData(-1)
                    window.location.reload()
                })
        }
        if (updateData > 0) {
            fetchTodoList()
        }
    }, [orderBy, updateData])

    useInterval(() => {
        setCurrentWindowSize(getCurrentWindowSize())
    }, 1000)

    useEffect(() => {
        initPageData()
    }, [initPageData])

    return (
        <div>
            <Container fluid>
                <DropdownButton
                    className="book-todo-btn-0"
                    variant="light"
                    as={ButtonGroup}
                    title="Order By"
                    id="bg-nested-order-by-dropdown"
                    onSelect={handleOrderByChange}
                >
                    {orderByDropdownOptions.map((options, index) => {
                        return options.value === orderBy ? (
                            <Dropdown.Item key={options.id} eventKey={index} active>
                                <span style={{ fontSize: '18px' }}>{options.value}</span>
                            </Dropdown.Item>
                        ) : (
                            <Dropdown.Item key={options.id} eventKey={index}>
                                <span style={{ fontSize: '18px' }}>{options.value}</span>
                            </Dropdown.Item>
                        )
                    })}
                </DropdownButton>
                {todoListData.map((task) => {
                    return (
                        <div key={task.id}>
                            <CompletedTodoList
                                id={task.id}
                                title={task.title}
                                author={task.author}
                                price={task.price}
                                nationality={task.nationality}
                                url={task.url}
                                dueDate={task.due_date}
                                isRead={task.is_read}
                                // daysSinceCreated={task.days_since_created}
                                lastModifyDate={convertToLocalDate(task.last_modify_date)}
                                createdAt={convertToLocalDate(task.created_at)}
                                hideTodoListItem={false}
                                editEnabled={false}
                                setRequestUpdate={setUpdateData}
                                currentWindowSize={currentWindowSize}
                                cardColor={randomColor()}
                            />
                        </div>
                    )
                })}
            </Container>
        </div>
    )
}
