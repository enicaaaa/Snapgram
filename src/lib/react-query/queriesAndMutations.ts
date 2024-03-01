import { INewPost, INewUser } from '@/types'
import { 
    useMutation, useQuery, useQueryClient,
} from '@tanstack/react-query'
import { createNewPost, createUserAccount, getRecentPosts, signInAccount, signOutAccount } from '../appwrite/api'
import { QUERY_KEYS } from './queryKeys'

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (
            user: {
                email: string,
                password: string
            }
        ) => signInAccount(user)
    });
}

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    });
}

export const useCreatePost = () => {
    const queryClient = useQueryClient();

    //invalidateQueries is React Query’s way to manually invalidate and optionally refetch a query. By 
    //"invalidating" a query, we mean marking its data as outdated or stale. Once a query is marked as stale, 
    //React Query will automatically refetch it the next time that data is required, ensuring your application's data remains up-to-date.
    return useMutation({
        mutationFn: (post: INewPost) => createNewPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            });
        }
    });
}

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts
    })
}
