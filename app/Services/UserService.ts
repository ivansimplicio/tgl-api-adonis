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

const setRoles = (user: User, userRoles: Array<string>) => {
  const { roles, ...rest } = user.serialize()
  return { roles: userRoles, ...rest }
}

export default loadUserRoles
