import { model, Schema } from 'mongoose'
import { IMemberRollCall } from '../types/memberrollcall'
 
const memberrollcallSchema: Schema = new Schema(
    {
        className: {
            type: String
        },
        date: {
            type: String
        },
        courseName: {
            type: String
        },
        groupName: {
            type: String
        },
        eID: {
            type: String
        },
        memberName: {
            type: String
        },
        status: {
            type: String
        },
        reason: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

memberrollcallSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
})
 
export default model<IMemberRollCall>('MemberRollCall', memberrollcallSchema)