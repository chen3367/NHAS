import { Document } from 'mongoose'

interface IMemberRollCall {
    eID: string
    memberName: string
    status: string
    reason: string
}

interface IGroupRollCall {
    groupName: string
    groupStatus: string
    members: Array<IMemberRollCall>
}

interface ICourse extends Document{
    className: string
    date: string
    courseName: string
    lecturer: string
    startTime: string
    endTime: string
    groups: Array<IGroupRollCall>
}

export { ICourse }