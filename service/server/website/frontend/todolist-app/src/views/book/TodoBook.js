import React, { useState, useEffect, useCallback } from 'react'
import { Button, ButtonGroup, Dropdown, DropdownButton, Container } from 'react-bootstrap'
import '../../assets/css/form_level_style.css'
import { apiFetchBookTodo, apiExportBookTodo } from '../../api.js'
import TodoList from './TodoList'
import AddTodo from './AddTodo'
import { orderByDropdownOptions, exportTodoListOptions } from './dropdown_options'
import { convertToLocalDateTime } from '../../components/Timer/dateFormat'
import useInterval from '../../components/Timer/useInterval'
import { getCurrentWindowSize } from '../../assets/js/getWindowSize.js'
import { randomColor } from '../../components/Cards/color'
import { exportTodoList } from '../../assets/js/exportFile.js'


export default function TodoBook(props) {
    const [currentWindowSize, setCurrentWindowSize] = useState(getCurrentWindowSize())
    const [todoListData, setTodoListData] = useState([])
    const [updateData, setUpdateData] = useState(1)
    const [hide, setHide] = useState(true)
    const orderBy =
        sessionStorage.getItem('book_todo_sort') === undefined || sessionStorage.getItem('book_todo_sort') === null
            ? 'latest_created_first'
            : sessionStorage.getItem('book_todo_sort')
    const [exportOption, setExportOption] = useState('csv')
    const openAddTodoCard = () => {
        setHide(false)
        setUpdateData(-1)
    }

    const setBookTodoSort = (value) => {
        sessionStorage.setItem('book_todo_sort', value)
    }

    const handleOrderByChange = (eventKey, event) => {
        setBookTodoSort(orderByDropdownOptions[eventKey].value)
        setUpdateData(1)
    }

    const handleExportCSV = async () => {
        apiExportBookTodo(false, orderBy, exportOption)
            .then((res) => {
                const data = res.data
                exportTodoList(data, 'book_incomplete_todolist')
            })
            .catch((err) => {
                // console.error(err.response)
            })
    }

    const handleExportOptionChange = (eventKey, event) => {
        setExportOption(exportTodoListOptions[eventKey].value)
        handleExportCSV()
    }

    const initPageData = useCallback(() => {
        const fetchTodoList = async () => {
            await apiFetchBookTodo(orderBy, false)
                .then((res) => {
                    const data = res.data.info
                    setTodoListData(data)
                    setUpdateData(0)
                })
                .catch((err) => {
                    setUpdateData(-1)
                })
        }
        if (updateData > 0) {
            fetchTodoList()
            setHide(true)
        } else if (updateData === 0) {
            setHide(true)
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
                <Button className="book-todo-btn-0" variant="primary" onClick={openAddTodoCard}>
                    New
                </Button>
                <DropdownButton
                    variant="light"
                    className="book-todo-btn-0"
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
                <DropdownButton
                    variant="light"
                    className="book-todo-btn-0"
                    as={ButtonGroup}
                    title='Export'
                    id="bg-nested-order-by-dropdown"
                    onSelect={handleExportOptionChange}
                >
                    {exportTodoListOptions.map((options, index) => {
                        return (
                            <Dropdown.Item key={options.id} eventKey={index}>
                                <span style={{ fontSize: '18px' }}>{options.value}</span>
                            </Dropdown.Item>
                        )
                        // return options.value === exportOption ? (
                        //     <Dropdown.Item key={options.id} eventKey={index} active>
                        //         <span style={{ fontSize: '18px' }}>{options.value}</span>
                        //     </Dropdown.Item>
                        // ) : (
                        //     <Dropdown.Item key={options.id} eventKey={index}>
                        //         <span style={{ fontSize: '18px' }}>{options.value}</span>
                        //     </Dropdown.Item>
                        // )
                    })}
                </DropdownButton>
                {hide ? null : (
                    <AddTodo
                        setRequestUpdate={setUpdateData}
                        currentWindowSize={currentWindowSize}
                        cardColor={randomColor()}
                    />
                )}
                {todoListData.map((task) => {
                    return (
                        <div key={task.id}>
                            <TodoList
                                id={task.id}
                                title={task.title}
                                author={task.author}
                                price={task.price}
                                nationality={task.nationality}
                                url={task.url}
                                dueDate={task.due_date}
                                isRead={task.is_read}
                                // daysSinceCreated={task.days_since_created}
                                lastModifyDate={convertToLocalDateTime(task.last_modify_date)}
                                createdAt={convertToLocalDateTime(task.created_at)}
                                dueDays={task.due_days}
                                willDueDays={task.will_due_days}
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
