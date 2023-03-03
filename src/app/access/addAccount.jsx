import { useEffect } from 'react'

import { useAddAccountMutation } from 'back/services/signApi'

export const AddAccountSelector = ({
    requestData,
    responseReceiver,
    isRequestActivated,
}) => {
    const intermediateResponseReceiver = function ({
        data,
        isLoading,
        isSuccess,
        error,
    }) {
        const requestName = 'Add Account'
        if (isLoading) {
            // console.log(requestName, '...')
        } else {
            if (!isSuccess) console.error(requestName, 'ERROR:', error)
            responseReceiver({ data, isSuccess, error })
        }
    }

    if (!isRequestActivated) return
    else
        return (
            <RequestSelector
                requestData={requestData}
                responseReceiver={intermediateResponseReceiver}
            />
        )
}

export const RequestSelector = ({ requestData, responseReceiver }) => {
    const [
        addAccount,
        { data, isUninitialized, isLoading, isSuccess, isError, error },
    ] = useAddAccountMutation()

    if (isUninitialized) addAccount(requestData)

    useEffect(() => {
        if (!isUninitialized) {
            const responseData = { data, isLoading, isSuccess, error: null }
            if (isError) responseData.error = error.data.detail
            responseReceiver(responseData)
        }
    }, [data])

    return
}
