import { model, Schema } from 'mongoose'
import { ICourse } from '../types/course'
 
const courseSchema: Schema = new Schema(
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
        lecturer: {
            type: String
        },
        startTime: {
            type: String
        },
        endTime: {
            type: String
        },
        groups: {
            type: Array
        }
    },
    {
        timestamps: true
    }
)

courseSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
})
 
export default model<ICourse>('Course', courseSchema)