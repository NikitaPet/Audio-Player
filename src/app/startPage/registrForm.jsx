import { useState } from 'react'

import { AddAccountSelector } from 'app/access/addAccount'

import { Logo } from './logo'
import { Form } from './startPageStyle'

export const RegistrForm = ({
    openLoginForm,
    test = { on: false, id: null, func: null },
}) => {
    const initState = { message: '', requestOn: null }
    const [state, setState] = useState(initState)
    // let newState = structuredClone(state)
    let newState = Object.assign({}, state)

    const requestOn = state.requestOn && !test.on
    const signupRequired = Boolean(requestOn)

    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordCheck, setPasswordCheck] = useState('')
    const formData = { email, username, password }
    // const formData = {
    //     username: 'testUser52',
    //     email: 'testUser52@mail.ru',
    //     password: 't546tgr52',
    // }

    const signupRequest = function () {
        let mistake
        if (password !== passwordCheck) mistake = 'Пароли не совпадают'
        if (!username || !password || !email) mistake = 'Заполните все поля'

        const isFormValid = !mistake
        newState.requestOn = isFormValid
        newState.message = isFormValid ? 'Регистрация...' : mistake
        setState(newState)
    }

    const signupResponse = function ({ isSuccess, error }) {
        console.log(error)

        if (isSuccess) {
            newState.message = 'Регистрация прошла успешно'
        } else {
            const errorData = error?.data || {}
            const errorDataKeys = Object.keys(errorData)
            const firstError = errorData?.[errorDataKeys?.[0]]
            const errorText = firstError || 'Неизвестная ошибка'
            newState.message = errorText
            if (newState.message === `FETCH_ERROR`)
                newState.message = 'Сервер не отвечает'
        }
        newState.requestOn = false
        setState(newState)
    }

    return (
        <Form className="reg">
            <Logo />

            <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
            />
            <input
                type="email"
                placeholder="e-mail"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <input
                type="password"
                placeholder="Пароль (минимум 8 символов)"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            <input
                type="password"
                placeholder="Повторите пароль"
                value={passwordCheck}
                onChange={(event) => setPasswordCheck(event.target.value)}
            />

            <button
                onClick={test.on ? test.func : signupRequest}
                className={'btn-dark'}
                disabled={state.requestOn}
                data-testid={test.id}
            >
                Зарегистрироваться
            </button>

            <button onClick={openLoginForm} className={'btn-ligth'}>
                Войти в аккаунт
            </button>

            <p>{state.message}</p>

            <AddAccountSelector
                requestData={formData}
                responseReceiver={signupResponse}
                isRequestActivated={signupRequired}
            />
        </Form>
    )
}
