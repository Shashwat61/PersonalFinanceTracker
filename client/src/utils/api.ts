import apiManager from "@/lib/apiManager";
import { DefaultGetManyParams } from "@/types";
import { appendParamsInUrl } from ".";

export function getSingle<R>(path:string){
    return apiManager.client.get<R>(path)
}
export function getMany<R, D extends DefaultGetManyParams>(path:string, params: D){
    console.log(params, 'params')
    const pathString = params?.id ? `${path}/${params.id}` : path
    // after=2024-10-06&before=2024-10-07&bankId=${primaryUserBank?.id}&from=${primaryUserBank?.listener_email}&limit=${10}
    if (params?.filters && params?.dates){
        const queryParams = appendParamsInUrl(params.filters, params.dates)
        return apiManager.client.get<R>(`${pathString}?${queryParams.toString()}`)
    }
    return apiManager.client.get<R>(pathString)
}

export function getManyWithoutParams<R>(path: string){
    return apiManager.client.get<R>(path)
}

export function updateSingle<R, D>(path: string, params: D) {
    return apiManager.client.put<R>(path, params);
  };
export function createSingle<R, D>(path: string, params: D){
    return apiManager.client.post<R>(path, params)
}