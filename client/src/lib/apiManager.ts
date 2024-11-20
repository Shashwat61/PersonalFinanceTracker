import { getCookie } from '@/utils';
import axios, { Axios, AxiosError, AxiosRequestConfig } from 'axios'

class ApiError extends Error{
    code: number | null;
    name: string 
    constructor(message: string, code: number | null = null){
        super(message)
        this.name = "ApiError"
        this.code = code
    }
}


class ApiManager {
    client:{
        get<T=unknown, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<T>;
        put<T=unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>
        post<T=unknown, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<T>
    } & Axios
    private static _instance: ApiManager
    constructor() {
        this.client = axios.create({
            baseURL: `${import.meta.env.VITE_BASE_API_URL}/api`,
            withCredentials: import.meta.env.MODE === "production",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        })
        this.client.interceptors.request.use((config)=>{
            const token = getCookie("bearer_token")
            if (token) {
                config.headers.Authorization = token
            }
            return config
        })
        this.client.interceptors.response.use((response)=>{ 
            return response.data
        },
        (error: AxiosError<{message: string, code: number}>)=> {
            let apiError: ApiError;
            if (error.response){
                console.error(
                    `API failed for url - ${error.config?.url}, method: ${error.config?.method?.toUpperCase()}, message:  ${error.response.data.message}, statusCode: ${error.response.status}` 
                )
                apiError = new ApiError(error.response.data.message || "Uknown Error", error.response.data.code)
            }
            else if (error.request){
                console.error(`Network Error - ${error.config?.url}, method: ${error.config?.method?.toUpperCase()}`)
                apiError = new ApiError("Request failed")
            }
            else{
                console.error(`Unknown Error - ${error.message}`)
                apiError = new ApiError("Unknown Error")
            }
            throw apiError
        })
    }
    public static getInstance(){
        if (!ApiManager._instance){
            ApiManager._instance = new ApiManager()
        }
        return ApiManager._instance
    }
}

export default ApiManager.getInstance()