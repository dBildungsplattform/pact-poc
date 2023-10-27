import axios, {AxiosPromise} from "axios";

export interface User {
    id: number;
    name: string;
    password: string;
}

export class UserClass implements User {
    id: number;
    name: string;
    password: string;
}

export class Consumer {
    private readonly url: string;
    private readonly port: number;

    constructor(endpoint: any) {
        this.url = endpoint.url;
        this.port = endpoint.port;
    }

    // This is not used but kept for presentation purposes
    public getUserViaRequest(id: number): AxiosPromise {
        return axios.request({
            baseURL: `${this.url}:${this.port}`,
            headers: {Accept: 'application/json'},
            method: 'GET',
            url: `/user?id=${id}`,
        });
    }

    public async getUser(id: number): Promise<User> {
        let axiosResponse = await axios.get<User>(
            `${this.url}:${this.port}/user?id=${id}`,
            {headers: {Accept: 'application/json'}});
        return axiosResponse.data;
    }

    public async getUserAsAxiosPromise(id: number): AxiosPromise {
        return axios.get<User>(`${this.url}:${this.port}/user?id=${id}`, {headers: {Accept: 'application/json'}});
    }

    public async createUser(name: string, password: string): Promise<number> {
        let axiosResponse = await axios.post<number>(`${this.url}:${this.port}/user?name=${name}&password=${password}`, {}, {headers: {Accept: 'text/plain', 'Content-Type': 'razor'}});
        return axiosResponse.data;
    }
}