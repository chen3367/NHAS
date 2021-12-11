import { model, Schema } from 'mongoose'
import { IGroupRollCall } from '../types/grouprollcall'
 
const grouprollcallSchema: Schema = new Schema(
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
        groupStatus: {
            type: String
        },
        members: {
            type: Array
        }
    },
    {
        timestamps: true
    }
)

grouprollcallSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
})
 
export default model<IGroupRollCall>('GroupRollCall', grouprollcallSchema)