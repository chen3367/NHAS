import { IGroupRollCall } from '../types/grouprollcall'
import GroupRollCall from '../models/grouprollcall'

class GroupRollCallRepoImpl {
  private constructor() {}
 
  static of(): GroupRollCallRepoImpl {
    return new GroupRollCallRepoImpl()
  }
 
  async getGroupRollCalls(): Promise<Array<IGroupRollCall>> {
    return GroupRollCall.find()
  }
 
  async addGroupRollCall(grouprollcallBody: IGroupRollCall): Promise<IGroupRollCall> {
    return GroupRollCall.create(grouprollcallBody)
  }

  async updateGroupRollCall(id: string, grouprollcallBody: IGroupRollCall): Promise<IGroupRollCall | null> {
    return GroupRollCall.findByIdAndUpdate(id, grouprollcallBody, { new: true })
  }

  async deleteGroupRollCall(id: string): Promise<IGroupRollCall | null> {
    return GroupRollCall.findByIdAndDelete(id)
  }

  async getGroupRollCall(id: string): Promise<IGroupRollCall | null> {
    return GroupRollCall.findById(id)
  }

  async getGroupRollCallsByParams(className: string, date: string, courseName: string): Promise<Array<IGroupRollCall> | null> {
    return GroupRollCall.find({
      className: className,
      date: date,
      courseName: courseName
    })
  }

}
 
export { GroupRollCallRepoImpl }