import { IMemberRollCall } from '../types/memberrollcall'
import MemberRollCall from '../models/memberrollcall'

class MemberRollCallRepoImpl {
  private constructor() {}
 
  static of(): MemberRollCallRepoImpl {
    return new MemberRollCallRepoImpl()
  }
 
  async getMemberRollCalls(): Promise<Array<IMemberRollCall>> {
    return MemberRollCall.find()
  }
 
  async addMemberRollCall(memberrollcallBody: IMemberRollCall): Promise<IMemberRollCall> {
    return MemberRollCall.create(memberrollcallBody)
  }

  async updateMemberRollCall(id: string, memberrollcallBody: IMemberRollCall): Promise<IMemberRollCall | null> {
    return MemberRollCall.findByIdAndUpdate(id, memberrollcallBody, { new: true })
  }

  async deleteMemberRollCall(id: string): Promise<IMemberRollCall | null> {
    return MemberRollCall.findByIdAndDelete(id)
  }

  async getMemberRollCall(id: string): Promise<IMemberRollCall | null> {
    return MemberRollCall.findById(id)
  }

  async getMemberRollCallsByParams(className: string, date: string, courseName: string, groupName: string): Promise<Array<IMemberRollCall> | null> {
    return MemberRollCall.find({
      className: className,
      date: date,
      courseName: courseName,
      groupName: groupName
    })
  }

}
 
export { MemberRollCallRepoImpl }