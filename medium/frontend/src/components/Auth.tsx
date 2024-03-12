import { Link } from "react-router-dom";
import { Signin } from "../pages/Signin";

export const Auth = ({type} :  {type : "signin" | "signup"}) => {
    return (
        <div className="h-screen flex justify-center items-center flex-col">
                     <div className="max-w-lg text-3xl font-bold text-center">
                        Create an account
                        </div>
                    <div className="text-slate-400 ">
                        Already have an account? <Link to={"./signin"}>Login
                            </Link>
                    </div>

        </div>
    );
}


export const LabelledInput = ({label, placeholder, onChange, value})=>{

     return (
        <>
        <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
        </label>
        <input onChange={onChange} type={ /*type || */ "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
        </div>
        </>
     )

   
}