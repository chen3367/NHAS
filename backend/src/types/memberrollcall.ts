import { Document } from 'mongoose' 

interface IMemberRollCall extends Document {
    className: string
    date: string
    courseName: string
    groupName: string
    eID: string
    memberName: string
    status: string
    reason: string
}
 
export { IMemberRollCall }