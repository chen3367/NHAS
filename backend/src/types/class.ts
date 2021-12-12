import { Document } from 'mongoose'

interface IClass extends Document {
    className: string
}

export { IClass }