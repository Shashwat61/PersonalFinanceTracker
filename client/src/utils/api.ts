import apiManager from "@/lib/apiManager";

export function getSingle<R>(path:string){
    return apiManager.client.get<R>(path)
}
export function getMany<R>(path:string){
    return apiManager.client.get<R>(path)
}
export function updateSingle<R, D>(path: string, data: D) {
    return apiManager.client.put<R>(path, data);
  };
export function createSingle<R, D>(path: string, data: D){
    return apiManager.client.post<R>(path, data)
}