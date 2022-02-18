import Roles from 'App/Enums/Roles'
import User from 'App/Models/User'

const allAdmins = async () => {
  const admins = await User.query().whereHas('roles', (query) => {
    query.where('roleId', '=', Roles.ADMIN)
  })
  return admins
}

export default allAdmins
