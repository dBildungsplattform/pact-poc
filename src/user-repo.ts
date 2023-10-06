import {User} from "./consumer";

export class UserRepo {
    userList: User[] = this.init();

    public constructor() {
    }

    public findUser(id: number) {
        return this.userList.find((user) => user.id == id);
    }

    public createUser(name: string, password: string): number {
        let find: number = this.userList.findIndex((user) => user.name === name && user.password === password);
        if(find === -1) {
            this.userList.push({id: this.userList.length, name: name, password: password});
            return this.userList.length;
        }
        return find + 1;
    }

    public clear(): void {
        this.init();
    }

    private init(): User[] {
        return [
            {id: 1, name: 'Theo', password: 'confidential'},
            {id: 2, name: 'Max', password: 'secret'},
            {id: 3, name: 'Lisa', password: 'hidden'}
        ];
    }

}