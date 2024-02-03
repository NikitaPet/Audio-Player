import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const BASE_API_URL = 'https://skypro-music-api.skyeng.tech'

const TRACKS_TAG = { type: 'TRACKS', id: 'LIST' }
const FAVORS_TAG = { type: 'FAVORS', id: 'LIST' }

export const signApi = createApi({
    reducerPath: 'sign',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URL,
        prepareHeaders: (headers, { getState }) => {
            const rootState = getState()

            const token = rootState?.user?.token
            if (token) headers.set('Authorization', `Bearer ${token.access}`)

            return headers
        },
    }),

    // | Зарегистрироваться      | POST | /user/signup/
    // | Войти                   | POST | /user/login/
    // | Получить ключ           | POST | /user/token/
    // | Обновить ключ           | POST | /user/token/refresh/

    endpoints: (builder) => ({
        // Access

        enterAccount: builder.mutation({
            query: (body) => ({
                url: 'user/login/',
                method: 'POST',
                body,
            }),
        }),

        addAccount: builder.mutation({
            query: (body) => ({
                url: 'user/signup/',
                method: 'POST',
                body,
            }),
        }),

        getToken: builder.mutation({
            query: (body) => ({
                url: 'user/token/',
                method: 'POST',
                body,
            }),
        }),

        refreshToken: builder.mutation({
            query: (body) => ({
                url: 'user/token/refresh/',
                method: 'POST',
                body,
            }),
        }),

        // Tracks

        getAllTracks: builder.query({
            query: () => 'catalog/track/all',
            providesTags: (result = []) => [
                ...result.map(({ id }) => ({ type: TRACKS_TAG.type, id })),
                TRACKS_TAG,
            ],
        }),

        getIndieChargeTracks: builder.query({
            query: () => 'catalog/selection/1',
            providesTags: (result = []) => forProvidesTags(result),
        }),

        getDanceHitsTracks: builder.query({
            query: () => 'catalog/selection/2',
            providesTags: (result = []) => forProvidesTags(result),
        }),

        getPlaylistOfDayTracks: builder.query({
            query: () => 'catalog/selection/3',
            providesTags: (result = []) => forProvidesTags(result),
        }),

        getAllFavors: builder.query({
            query: () => 'catalog/track/favorite/all/',
            providesTags: (result = []) => [
                ...result.map(({ id }) => ({ type: FAVORS_TAG.type, id })),
                FAVORS_TAG,
            ],
        }),

        // Acts

        addLike: builder.mutation({
            query: (data) => ({
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                url: `catalog/track/${data.trackId}/favorite/`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [FAVORS_TAG],
        }),

        delLike: builder.mutation({
            query: (data) => ({
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
                url: `catalog/track/${data.trackId}/favorite/`,
                method: 'DELETE',
                body: data,
            }),
            invalidatesTags: [FAVORS_TAG],
        }),
    }),
})

export default signApi
export const {
    // Access
    useEnterAccountMutation,
    useAddAccountMutation,
    useGetTokenMutation,
    useRefreshTokenMutation,
    // Tracks
    useGetAllTracksQuery,
    useGetAllFavorsQuery,
    useGetIndieChargeTracksQuery,
    useGetDanceHitsTracksQuery,
    useGetPlaylistOfDayTracksQuery,
    // Acts
    useAddLikeMutation,
    useDelLikeMutation,
} = signApi

const forProvidesTags = (result = []) =>
    result.items
        ? [
              ...result.items.map(({ id }) => ({
                  type: TRACKS_TAG.type,
                  id,
              })),
              TRACKS_TAG,
          ]
        : [
              ...result.map(({ id }) => ({
                  type: TRACKS_TAG.type,
                  id,
              })),
              TRACKS_TAG,
          ]
