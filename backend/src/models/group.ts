import { model, Schema } from 'mongoose'
import { IGroup } from '../types/group'
 
const groupSchema: Schema = new Schema(
    {
        className: {
            type: String
        },
        groupName: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

groupSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
})
 
export default model<IGroup>('Group', groupSchema)