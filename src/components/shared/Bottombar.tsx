import { bottombarLinks } from "@/constants";
import { useLocation, Link } from "react-router-dom";

const Bottombar = () => {
    const { pathname } = useLocation();

    return (
        <section className="z-50 flex-between w-full sticky bottom-0 rounded-t-[20px] px-5 py-4 md:hidden">
            {bottombarLinks.map((link) => {
                        const isActive = pathname == link.route;
                        return (
                            <Link 
                            to={link.route}  
                            key={link.label} 
                            className={`${isActive && 'bg-primary-500 rounded-[10px]'} flex-center flex-col gap-1 p-2 transition`}
                            >
                                <img 
                                    src={link.imgURL} 
                                    alt={link.label} 
                                    width={16}
                                    height={16}
                                    className={`${isActive && 'invert-white'}`}
                                />
                                <p className="tiny-medium text-light-2">{link.label}</p>
                            </Link>
                        )
                    })}
        </section>
    )
}

export default Bottombar;