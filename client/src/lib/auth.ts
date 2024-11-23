import apiManager from "./apiManager";

export async function logout(): Promise<{message: string}>{
 return await apiManager.client.post("/auth/logout")
}