import { loginUserApi, registerUserApi } from "../api/authApi";

export const registerUserService = async (formData) => {
    try{
        const response = await registerUserApi(formData)
        return response.data //response data
    }catch(err){
        throw err.response?.data || {message: "Registration failed"}
    }
}
 export const loginUserService = async (formData) => {
    try{
        const response = await loginUserApi (formData)
        return response.data
    }catch(err){
         throw err.response?.data || {message: "Login failed"}
    }
 }