import { model, Schema } from 'mongoose'
import { IClass } from '../types/class'
 
const classSchema: Schema = new Schema(
    {
        className: {
            type: String
        }
    },
    {
        timestamps: true
    }
)

classSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
})
 
export default model<IClass>('Class', classSchema)