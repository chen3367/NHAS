import { IGroup } from '../types/group'
import Group from '../models/group'

class GroupRepoImpl {
  private constructor() {}
 
  static of(): GroupRepoImpl {
    return new GroupRepoImpl()
  }
 
  async getGroups(): Promise<Array<IGroup>> {
    return Group.find()
  }
 
  async addGroup(groupBody: IGroup): Promise<IGroup> {
    return Group.create(groupBody)
  }

  async updateGroup(class_id: string, groupBody: IGroup): Promise<IGroup | null> {
    return Group.findByIdAndUpdate(class_id, groupBody, { new: true })
  }

  async deleteGroup(class_id: string): Promise<IGroup | null> {
    return Group.findByIdAndDelete(class_id)
  }

  async getGroup(group_id: string): Promise<IGroup | null> {
    return Group.findById(group_id)
  }

  // async getGroupsByClass(className: string): Promise<IGroup | null> {
  //   return Group.find({
  //     className: className
  //   })
  // }

}
 
export { GroupRepoImpl }