import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutations";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Explore = () => {
    const { ref, inView } = useInView();

    const { data: posts, fetchNextPage, hasNextPage } = useGetPosts();

    const [searchValue, setSearchValue] = useState('');

    const debouncedValue = useDebounce(searchValue, 500);
    const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedValue);
    
    useEffect(() => {
        if(inView && hasNextPage && !searchValue) {
            fetchNextPage()
        }
    }, [inView, searchValue]);

    if(!posts)
    {
        return (
            <div className="flex-center w-full h-full">
                <Loader/>
            </div>
        )
    }

    const shouldShowSearchResults = searchValue !== "";
    const shouldShowPosts = !shouldShowSearchResults && posts?.pages.every((item) => item?.documents.length === 0);

    return (
        <div className="flex flex-col flex-1 items-center overflow-scroll py-10 px-5 md:p-14">
            <div className="max-w-5xl flex flex-col items-center w-full gap-6 md:gap-9">
                <h2 className="text-[24px] font-bold leading-[140%] tracking-tighter md:text-[30px] md:font-bold md:leading-[140%] md:tracking-tighter w-full">Search Posts</h2>
                <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
                    <img src="public/assets/icons/search.svg" width={24} height={24} alt="search"/>
                    <Input
                        type="text"
                        placeholder="Search"
                        className="h-12 bg-dark-4 border-none placeholder:text-light-4 focus-visible:ring-0 focus-visible:ring-offset-0 ring-offset-0 !important"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
            </div>
            <div className="flex-between w-full max-w-5xl mt-16 mb-7">
                <h3 className="text-[18px] font-bold leading-[140%] md:text-[24px] md:font-bold md:leading-[140%] tracking-tighter">Popular Today</h3>
                <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
                    <p className="text-[14px] font-medium leading-[140%] md:text-[16px] md:font-medium md:leading-[140%] text-light-2">All</p>
                    <img src="/public/assets/icons/filter.svg" alt="filter" width={20} height={20}/>
                </div>
            </div>
            <div className="flex flex-wrap gap-9 w-full max-w-5xl">
                {shouldShowSearchResults ? (
                    <SearchResults isSearchFetching={isSearchFetching} searchedPosts={searchedPosts}/>
                ) : shouldShowPosts ? (
                    <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
                ) : posts.pages.map((item, index) => (
                    <GridPostList key={`page-${index}`} posts={item.documents}/> 
                ))}
            </div>

            {hasNextPage && !searchValue && (
                <div ref={ref} className="mt-10">
                    <Loader />
                </div>
            )}
        </div>
    )
}

export default Explore;