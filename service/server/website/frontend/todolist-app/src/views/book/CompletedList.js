import React, { useState, useEffect, useCallback } from 'react'
import { ButtonGroup, Dropdown, DropdownButton, Container } from 'react-bootstrap'
import '../../assets/css/form_level_style.css'
import { apiFetchBookTodo, apiExportBookTodo } from '../../api.js'
import CompletedTodoList from './CompletedTodoList'
import { orderByDropdownOptions, exportTodoListOptions } from './dropdown_options'
import { convertToLocalDateTime } from '../../components/Timer/dateFormat'
import useInterval from '../../components/Timer/useInterval'
import { getCurrentWindowSize } from '../../assets/js/getWindowSize.js'
import { randomColor } from '../../components/Cards/color'
import { exportTodoList } from '../../assets/js/exportFile.js'


export default function CompleteList(props) {
    const [currentWindowSize, setCurrentWindowSize] = useState(getCurrentWindowSize())
    const [todoListData, setTodoListData] = useState([])
    const [updateData, setUpdateData] = useState(1)
    const orderBy =
        sessionStorage.getItem('book_todo_sort') === undefined || sessionStorage.getItem('book_todo_sort') === null
            ? 'latest_created_first'
            : sessionStorage.getItem('book_todo_sort')
    const [exportOption, setExportOption] = useState('csv')
    const setBookTodoSort = (value) => {
        sessionStorage.setItem('book_todo_sort', value)
    }

    const handleOrderByChange = (eventKey, event) => {
        setBookTodoSort(orderByDropdownOptions[eventKey].value)
        setUpdateData(1)
    }

    const handleExportCSV = async () => {
        apiExportBookTodo(true, orderBy, exportOption)
            .then((res) => {
                const data = res.data
                exportTodoList(data, 'book_completed_todolist')
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
            await apiFetchBookTodo(orderBy, true)
                .then((res) => {
                    const data = res.data.info
                    setTodoListData(data)
                    setUpdateData(-1)
                })
                .catch((err) => {
                    setUpdateData(-1)
                    // window.location.reload()
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
                <DropdownButton
                    variant="light"
                    className="book-todo-btn-0"
                    as={ButtonGroup}
                    title="Export"
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
                                lastCompletedDate={convertToLocalDateTime(task.last_modify_date)}
                                createdAt={convertToLocalDateTime(task.created_at)}
                                dueDays={task.due_days}
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
