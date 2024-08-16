import { createClient, RedisClientType } from "redis";
class RedisClient {
    private client: RedisClientType;
    private static _instance: RedisClient
    private constructor(){
        this.client = createClient()
    }
    static getInstance(){
        if(!RedisClient._instance){
            RedisClient._instance = new RedisClient()
        }
        return RedisClient._instance
    }

    async getKey(key: string){
        await this.client.get(key)
    }
    async setKey(key: string, value: string, expiry: number){
        await this.client.set(key, value, {EX: expiry})
    }
    async deleteKey(key: string){
        await this.client.del(key)
    }
    async connect(){
        this.client.on('error', err => console.log('error in connecting redis'))
        this.client.on('reconnect', () => console.log('reconnecting redis'))
        this.client.on('ready', () => console.log('redis is ready'))
        this.client.on('connect', () => console.log('redis connected'))
        await this.client.connect()
    }
}
export const redisClient = RedisClient.getInstance()