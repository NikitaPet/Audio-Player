import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { userFromStore } from 'back/selectors/userSelector'
import { globalSetUser, globalSetUserToken } from 'back/slices/userSlice'
import { clearAccount } from 'back/slices/accountSlice'

import { TokenRefreshTimerSelector } from 'app/access/tokenRefresh'

import { AppRoutes } from './app/routes'
import { appThemes } from './app/appThemes'
import { GlobalStyle } from './app/globalStyle'
import { AppStyle as Style } from './app/appStyle'

const App = () => {
    const dispatch = useDispatch()
    const initUser = { token: null, data: null, id: null }
    const [user, setUser] = useState(initUser)
    const changeUser = (user) => {
        const freshToken = JSON.parse(localStorage.getItem('token'))
        if (freshToken) user.token = freshToken
        dispatch(globalSetUser(user))
        setUser(user)
    }
    const accessСontrol = {
        LogIn: ({ data, token }) => {
            const newUser = { id: data.id, data, token }
            changeUser(newUser)
            localStorage.setItem('user', JSON.stringify(newUser))
            const username = data.username
            console.log(mark(username), `Account LOG IN completed`)
        },
        LogOut: () => {
            changeUser(initUser)
            dispatch(clearAccount())
            localStorage.clear()
            const username = user.data.username
            console.log(mark(username), `Account LOG OUT completed`)
        },
    }

    const [theme, setTheme] = useState(appThemes['dark'])
    const appTheme = {
        current: theme,
        set: (nonStandartThemeName = null) => {
            let newThemeName = theme.name === 'dark' ? 'light' : 'dark'
            if (nonStandartThemeName) newThemeName = nonStandartThemeName
            const newTheme = appThemes[newThemeName]
            if (newTheme) setTheme(newTheme)
        },
    }

    let userInLocalStorage = JSON.parse(localStorage.getItem('user'))
    if (!userInLocalStorage) userInLocalStorage = initUser
    const isUserDataAdded = userInLocalStorage.id === user.id
    useEffect(() => {
        if (!userInLocalStorage) changeUser(initUser)
        else if (!isUserDataAdded) changeUser(userInLocalStorage)
    })

    return (
        <appContext.Provider value={{ appTheme, accessСontrol }}>
            <GlobalBox
                user={user}
                setUser={setUser}
                isUserDataAdded={isUserDataAdded}
                appTheme={appTheme}
            />
            <GlobalStyle data={appTheme.current} />
        </appContext.Provider>
    )
}

const GlobalBox = ({ user, setUser, isUserDataAdded, appTheme }) => {
    const dispatch = useDispatch()

    const userInApp = user
    const userInStore = useSelector(userFromStore)

    const userTokenInApp = userInApp?.token
    const userTokenInStore = userInStore?.token

    const username = user?.data?.username
    const isGlobalUserRelevant = userInApp?.id === userInStore?.id

    const getRefreshedToken = ({ data, isSuccess, error }) => {
        if (isSuccess) {
            const token = structuredClone(userTokenInStore)
            if (data.access !== token?.access) {
                console.log(mark(username), `Token refresh`)

                token.access = data.access
                dispatch(globalSetUserToken({ token }))
                localStorage.setItem('token', JSON.stringify(token))

                user.token = token
                setUser(structuredClone(user))
            }
        } else {
            console.log(mark(username), `Token refresh ERROR:`, error)
        }
    }

    useEffect(() => {
        if (!isGlobalUserRelevant) dispatch(globalSetUser(userInApp))
    })

    if (isUserDataAdded && isGlobalUserRelevant)
        return (
            <div className="container">
                <Style data={appTheme.current}>
                    <AppRoutes />
                </Style>

                {userTokenInApp && (
                    <TokenRefreshTimerSelector
                        requestData={userTokenInApp}
                        responseReceiver={getRefreshedToken}
                    />
                )}
            </div>
        )
    else return
}

const mark = (username) => {
    const date = new Date()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const seconds = date.getSeconds()
    const hh = (hours < 10 ? '0' : '') + hours
    const mm = (minutes < 10 ? '0' : '') + minutes
    const ss = (seconds < 10 ? '0' : '') + seconds
    const time = `[${hh}:${mm}:${ss}]`
    return `${time} ${username}: `
}

const appContext = React.createContext()
export { appContext }
export default App
