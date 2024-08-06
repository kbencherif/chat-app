import { UsersManager } from '../src/utils/usersManager'

describe('testing userManagement', () => {
    const usersManager: UsersManager = new UsersManager()

    test('Check non existant user', () => {
        expect(usersManager.userExists("Test")).toBe(false)
    })

    test('Add user', () => {
        usersManager.addUser("Test")
        expect(usersManager.userExists("Test")).toBe(true)
    })

    test('Check  existant user', () => {
        usersManager.addUser("Test")
        expect(usersManager.userExists("Test")).toBe(true)
    })

    test('Delete user', () => {
        usersManager.addUser("Test")
        expect(usersManager.userExists("Test")).toBe(true)
        usersManager.deleteUser("Test")
        expect(usersManager.userExists("Test")).toBe(false)
    })
})
