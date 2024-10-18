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
        const queryParams = appendParamsInUrl(params.filters, params.dates, {cursor:params.cursor})
        return apiManager.client.get<R>(`${pathString}?${queryParams.toString()}`)
    }
    return apiManager.client.get<R>(pathString)
}

export function getManyWithoutParams<R>(path: string){
    return apiManager.client.get<R>(path)
}

export const updateSingle = <R, D extends { id: string }>(path: string, data: D) => {
    const { id, ...rest } = data;
    return apiManager.client.put<R>(`${path}/${id}`, rest);
  };

export function updateMany<R, D>(path: string, data:D){
    return apiManager.client.put<R>(path, data)
}
export function createSingle<R, D>(path: string, params: D){
    return apiManager.client.post<R>(path, params)
}