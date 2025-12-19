import { useMutation } from "@tanstack/react-query";
import { loginUserService } from "../services/authServices";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthProvider";


export const useLoginUser =() => {
    const { login } =useContext(AuthContext)
    return useMutation (
        {
            mutationFn: loginUserService,
            mutationKey: ["login_key"],
            onSuccess:(data)=> { //data -> body
                login(data?.data, data?.token)
                toast.success(data?.message || "Login Success")
            },
            onError:(err) => {
                toast.error(err?.message || "Login Falied")
            }
        }
    )
}