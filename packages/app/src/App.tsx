import React, { ComponentProps, useEffect, useState } from 'react'
import { trpc } from './utils/trpc'
import clsx from 'clsx'
// import { Prisma } from '@todos/www'
import { connect, mapProps } from './utils/connect'

type Todos = Awaited<ReturnType<typeof trpc.todoRouter.findAll.query>>
type Todo = Todos[number]

function useTodos() {
  const [input, setInput] = useState('')
  const [todos, setTodos] = useState<Todos>([])

  const getTodos = async () => {
    const data = await trpc.todoRouter.findAll.query()
    setTodos(data)
  }

  const addNewTodo = async () => {
    await trpc.todoRouter.create.mutate({
      title: input,
    })

    setInput('')
    getTodos()
  }

  useEffect(() => {
    getTodos()
  }, [])

  return {
    input,
    setInput,
    todos,
    setTodos,
    addNewTodo,
    getTodos,
  }
}

const Tag: React.FC<{
  type: 'success' | 'warning' | 'danger' | 'primary',
  children: React.ReactNode | React.ReactNode[],
  disabled?: boolean,
  onClick?: () => void
}> = ({
  type = 'primary',
  children = '',
  disabled = false,
  onClick = () => {},
}) => {
  return (
    <span
      className={clsx(
        'px-2 py-1 rounded text-sm text-white cursor-pointer',
        {
          'bg-green-500': type === 'success',
          'bg-orange-500': type === 'warning',
          'bg-red-500': type === 'danger',
          'bg-blue-500': type === 'primary',
        },
        {
          'cursor-not-allowed bg-opacity-50': disabled,
        }
      )}
      onClick={(e) => {
        e.stopPropagation()
        !disabled && onClick()
      }}
    >
      {children}
    </span>
  )
}

const TodoTag = connect(
  Tag,
  mapProps(
    // {
    //   disabled: false,
    // },
    (props) => {
      const ret: ComponentProps<typeof Tag> = {
        type: 'primary',
        children: 'Created',
      }
      if (props.status === 1) {
        ret.type = 'primary'
        ret.children = 'Created'
      } else if (props.status === 2) {
        ret.type = 'warning'
        ret.children = 'Pending'
      } else if (props.status === 3) {
        ret.type = 'success'
        ret.children = 'Finished'
      } else if (props.status === 4) {
        ret.type = 'danger'
        ret.children = 'Abandoned'
      }
      return ret
    }
  )
) as unknown as React.FC<{ status: number, disabled?: boolean, onClick?: () => void }>


const TodoModal: React.FC<{
  show: boolean
  setShow: (b: boolean) => void
  todo?: Todo
  setStatus: (status: number) => void
}> = ({ show, setShow, todo, setStatus }) => {
  if (!show) return null

  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center"
      onClick={() => setShow(false)}
    >
      <div className="p-2 bg-white">
        <h2>Change status:</h2>
        <div className="flex gap-x-2">
          {[1, 2, 3, 4].map(status => (
            <TodoTag
              status={status}
              key={status}
              disabled={todo?.status === status}
              onClick={() => setStatus(status)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

const TodoList: React.FC<{
  todos: Todos,
  onClickTag?: (todo: Todo) => void
}> = ({
  todos,
  onClickTag = () => {},
}) => {
  return (
    <div className="relative">
      <div className={clsx('shadow rounded')}>
        {todos.map(todo => (
          <div
            key={todo.id}
            className={clsx(
              'flex justify-between',
              'p-2 hover:bg-red-400 transition-all'
            )}
          >
            <span>{todo.title}</span>
            <TodoTag status={todo.status} onClick={() => onClickTag(todo)} />
          </div>
        ))}
      </div>
    </div>
  )
}

// 尽量多使用 UI 组件，这样后续状态的迁移会比较方便
function App() {
  const {
    input,
    setInput,
    todos,
    addNewTodo,
    getTodos,
  } = useTodos()

  const [show, setShow] = useState(false)
  const [todo, setTodo] = useState<Todo>()

  const onClickTodoTag = (todo: Todo) => {
    console.log('click', todo)
    setShow(true)
    setTodo(todo)
  }

  const onSetStatus = async (status: number) => {
    if (!todo) return
    await trpc.todoRouter.update.mutate({ id: todo.id, data: { status } })
    getTodos()
    setShow(false)
  }

  return (
    <div className={clsx('box-border overflow-hidden w-[400px] m-auto my-5 shadow-xl rounded')}>
      <input
        className={clsx('bg-[#f5f5f5] p-2 w-full border-none')}
        placeholder='Enter todo name to add or searching...'
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyUp={e => e.key === 'Enter' && addNewTodo()}
      />

      <TodoList todos={todos} onClickTag={onClickTodoTag} />

      <TodoModal show={show} todo={todo} setShow={setShow} setStatus={onSetStatus} />
    </div>
  )
}

export default App
