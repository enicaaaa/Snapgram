import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { Input } from "../ui/input"
import { PostValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useUserContext } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { useCreatePost, useUpdatedPost } from "@/lib/react-query/queriesAndMutations"

type PostFormProps = {
    post?: Models.Document;
    action: 'Create' | 'Update';
}

const PostForm = ({ post, action }: PostFormProps) => {
    const { user } = useUserContext();
    const navigate = useNavigate();
    const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost();
    const { mutateAsync: updatePost, isPending: isLoadingUpdate } = useUpdatedPost();


    // 1. Define your form.
    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
        caption: post ? post?.caption : "",
        file: [],
        location: post ? post?.location : "",
        tags: post ? post.tags.join(',') : ""
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof PostValidation>) {
        if(post && action === 'Update') 
        {
            await updatePost({
                ...values,
                postId: post?.$id,
                imageId: post?.imageId,
                imageUrl: post?.imageUrl
            });

            navigate(`/posts/${post.$id}`);
        }

        await createPost({
            ...values,
            userId: user.id
        });

        navigate("/");
    }

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Caption</FormLabel>
                <FormControl>
                  <Textarea className="h-36 bg-dark-3 rounded-xl border-none focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-light-3 !important custom-scrollbar" {...field} />
                </FormControl>
                <FormMessage className="text-red !important"/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Add Photos</FormLabel>
                <FormControl>
                  <FileUploader fieldChange={field.onChange} mediaUrl={post?.imageUrl}/>
                </FormControl>
                <FormMessage className="text-red !important"/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Add Location</FormLabel>
                <FormControl>
                  <Input className="shad-input" {...field} />
                </FormControl>
                <FormMessage className="shad-form_message"/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="shad-form_label">Add Tags (separated by comma ",")</FormLabel>
                <FormControl>
                  <Input 
                    className="shad-input" {...field} 
                    type="text"
                    placeholder="JS, React, NextJS, TypeScript"
                  />
                </FormControl>
                <FormMessage className="shad-form_message"/>
              </FormItem>
            )}
          />
          <div className="flex gap-4 items-center justify-end">
            <Button type="button" className="shad-button_dark_4">Cancel</Button>
            <Button 
                type="submit" 
                className="shad-button_primary whitespace-nowrap"
                disabled={isLoadingCreate || isLoadingUpdate}
            >
                {isLoadingCreate || isLoadingUpdate && 'Loading...'}
                {action} Post
            </Button>
          </div>
        </form>
      </Form>
    )
}

export default PostForm;