import { Document } from 'mongoose'

interface IGroup extends Document{
    className: string
    groupName: string
    groupLeader: string
}

export { IGroup }