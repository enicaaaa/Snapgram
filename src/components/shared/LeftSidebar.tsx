import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import { Button } from "../ui/button";

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { user } = useUserContext();
    const { mutate: signOut, isSuccess } = useSignOutAccount();

    useEffect(() => {
     if(isSuccess) {
        navigate(0);
     }   
    },[isSuccess])

    return (
        <nav className="hidden md:flex px-6 py-10 flex-col justify-between min-w-[270px] bg-dark-2">
            <div className="flex flex-col gap-11">
                <Link to="/" className="flex gap-3 items-center">
                    <img src="/public/assets/images/logo.svg" alt="logo" width={130} height={325}/>
                </Link>
                <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
                    <img src={user.imageUrl || "/assets/icons/profle-placeholder.svg"} alt="profile" className="h-14 w-14 rounded-full"/>
                    <div className="flex flex-col">
                        <p className="body-bold">
                            {user.name}
                        </p>
                        <p className="text-[14px] font-normal leading-[140%] text-light-3">
                            {user.username}
                        </p>
                    </div>
                </Link>
                <ul className="flex flex-col gap-6">
                    {sidebarLinks.map((link: INavLink) => {
                        const isActive = pathname == link.route;
                        return (
                            <li key={link.label} className={`rounded-lg base-medium hover:bg-primary-500 transition ${isActive && 'bg-primary-500'}`}>
                                <NavLink to={link.route}  className="flex gap-4 items-center p-4">
                                    <img src={link.imgURL} alt={link.label} className={`group-hover:invert-white ${isActive && 'invert-white'}`}/>
                                    {link.label}
                                </NavLink>
                            </li>
                        )
                    })}
                </ul>
            </div>    
            <Button 
            variant="ghost" 
            className="shad-button_ghost"
            onClick={ () => signOut() }
            >
                <img src="/public/assets/icons/logout.svg" alt="logout" />
                <p className="small-medium lg:base-medium">Logout</p>
            </Button>
        </nav>
    )
}

export default LeftSidebar;