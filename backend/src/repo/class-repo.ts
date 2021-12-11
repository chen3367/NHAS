import { IClass } from '../types/class'
import Class from '../models/class'

class ClassRepoImpl {
  private constructor() {}
 
  static of(): ClassRepoImpl {
    return new ClassRepoImpl()
  }
 
  async getClasses(): Promise<Array<IClass>> {
    return Class.find()
  }
 
  async addClass(classBody: IClass): Promise<IClass> {
    return Class.create(classBody)
  }

  async updateClass(id: string, classBody: IClass): Promise<IClass | null> {
    return Class.findByIdAndUpdate(id, classBody, { new: true })
  }

  async deleteClass(id: string): Promise<IClass | null> {
    return Class.findByIdAndDelete(id)
  }

  async getClass(id: string): Promise<IClass | null> {
    return Class.findById(id)
  }

}
 
export { ClassRepoImpl }