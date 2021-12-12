import { Document } from 'mongoose'

interface IMemberRollCall {
    eID: string
    memberName: string
    status: string
    reason: string
}

interface IGroupRollCall extends Document{
    className: string
    date: string
    courseName: string
    groupName: string
    groupStatus: string
    members: Array<IMemberRollCall>
}

export { IGroupRollCall }