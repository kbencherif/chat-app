interface User {
    username: string
}

class UsersManager {
    private users: User[]

    constructor() {
        this.users = []
    }

    public addUser(username: string): void {
        if (!this.userExists(username)) {
            this.users.push({ username })
        }
    }

    public deleteUser(username: string): void {
        const i = this.users.map(e => e.username).indexOf(username)
        if (i > -1) {
            this.users.splice(i, 1)
        }
    }

    public userExists(username: string): boolean {
        return this.users.map(e => e.username).indexOf(username) != -1
    }
}

export { UsersManager }
