import Roles from 'App/Enums/Roles'
import User from 'App/Models/User'

const loadUserRoles = async (user: User) => {
  const roles: Array<string> = []
  await user.load('roles')
  for (const element of user.roles) {
    await element.load('role')
    roles.push(element.role.role)
  }
  return setRoles(user, roles)
}

const userHasRole = async (user: User, role: Roles) => {
  await user.load('roles')
  const roles: Array<number> = []
  user.roles.forEach((element) => {
    roles.push(element.roleId)
  })
  return roles.includes(role)
}

const setRoles = (user: User, userRoles: Array<string>) => {
  const { roles, ...rest } = user.serialize()
  return { roles: userRoles, ...rest }
}

export { userHasRole }
export default loadUserRoles
