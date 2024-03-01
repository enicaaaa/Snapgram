import { useUserContext } from "@/context/AuthContext";
import { formatTimeAgo } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";

type PostCardProps = {
    post: Models.Document
}

const PostCard = ({ post }: PostCardProps) => {
    const { user } = useUserContext();
    if(!post.creator) return;

    return (
        <div className="bg-dark-2 rounded-3xl border border-dark-4 p-5 lg:p-7 w-full max-w-screen-sm">
            <div className="flex-between">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${post.creator.$id}`}>
                        <img 
                            src={post?.creator?.imageUrl || '/public/assets/icons/profile-placeholder.svg'} 
                            className="rounded-full w-12 lg:h-12"
                            alt="creator"
                        />
                    </Link>
                    <div className="flex flex-col">
                        <p className="text-[16px] lg:text-[18px] font-bold leading-[140%] text-light-1">
                          {post.creator.name}  
                        </p>
                        <div className="flex-center gap-2 text-light-3">
                            <p className="text-[12px] font-semibold leading-[140%] lg:text-[14px]">
                                {formatTimeAgo(post.$createdAt)}
                            </p>
                            -
                            <p className="text-[12px] font-semibold leading-[140%] lg:text-[14px]">
                                {post.location}
                            </p>
                        </div>
                    </div>
                </div>
                <Link to={`/update-post/${post.$id}`} className={`${user.id !== post.creator.$id && "hidden"}`}>
                    <img 
                        src="/public/assets/icons/edit.svg"
                        alt="edit"
                        width={20}
                        height={20}
                    />
                </Link>
            </div>
            <Link to={`/posts/${post.$id}`}>
                <div className="text-[14px] font-medium leading-[140%] lg:text-[16px] py-5">
                    <p>{post.caption}</p>
                    <ul className="flex gap-1 mt-2">
                        {post.tags.map((tag: string) => (
                            <li key={tag} className="text-light-3">
                                #{tag}
                            </li>
                        ))}
                    </ul>
                </div>
                <img 
                    src={post.imageUrl || '/public/assets/icons/profile-placeholder.svg'}
                    className="h-64 xs:h-[400px] lg:h-[450px] w-full rounded-[24px] object-cover mb-5"
                    alt="popst image"
                />
            </Link>
        </div>
    )
}

export default PostCard;