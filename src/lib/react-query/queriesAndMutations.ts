import { INewPost, INewUser, IUpdatePost } from '@/types'
import { 
    useInfiniteQuery,
    useMutation, useQuery, useQueryClient,
} from '@tanstack/react-query'
import { createNewPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitivePosts, getPostById, getRecentPosts, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost } from '../appwrite/api'
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
    });
}

export const useLikePosts = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, likesArray }: { postId: string; likesArray: string[]}) => likePost(postId, likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ 
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            });
            queryClient.invalidateQueries({ 
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            });
            queryClient.invalidateQueries({ 
                queryKey: [QUERY_KEYS.GET_POSTS]
            });
            queryClient.invalidateQueries({ 
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            });
        }
    });
}

export const useSavePosts = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, userId }: { postId: string; userId: string }) => savePost(postId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            });
            queryClient.invalidateQueries({ 
                queryKey: [QUERY_KEYS.GET_POSTS]
            });
            queryClient.invalidateQueries({ 
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            });
        }
    });
}

export const useDeleteSavedPosts = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ savedRecordId }: { savedRecordId: string }) => deleteSavedPost(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            });
            queryClient.invalidateQueries({ 
                queryKey: [QUERY_KEYS.GET_POSTS]
            });
            queryClient.invalidateQueries({ 
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            });
        }
    });
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}

export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    });
}

export const useUpdatedPost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    });
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) => deletePost(postId, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    });
}

export const useGetPosts = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitivePosts,
        getNextPageParam: (lastPage) => {
            if(lastPage && lastPage.documents.length === 0) return null;

            const lastId = lastPage?.documents[lastPage?.documents.length - 1].$id;

            return lastId;
        }
    })
}

export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts({searchTerm}),
        enabled: !!searchTerm
    })
}