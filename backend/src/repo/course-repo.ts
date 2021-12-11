import { ICourse } from '../types/course'
import Course from '../models/course'

class CourseRepoImpl {
  private constructor() {}
 
  static of(): CourseRepoImpl {
    return new CourseRepoImpl()
  }
 
  async getCourses(): Promise<Array<ICourse>> {
    return Course.find()
  }
 
  async addCourse(courseBody: ICourse): Promise<ICourse> {
    return Course.create(courseBody)
  }

  async updateCourse(class_id: string, courseBody: ICourse): Promise<ICourse | null> {
    return Course.findByIdAndUpdate(class_id, courseBody, { new: true })
  }

  async deleteCourse(class_id: string): Promise<ICourse | null> {
    return Course.findByIdAndDelete(class_id)
  }

  async getCourse(course_id: string): Promise<ICourse | null> {
    return Course.findById(course_id)
  }

  async getCoursesByClass(className: string): Promise<Array<ICourse> | null> {
    return Course.find({
      className: className
    })
  }

  async getCoursesByParams(className: string, date: string): Promise<Array<ICourse> | null> {
    return Course.find({
      className: className,
      date: date
    })
  }

}
 
export { CourseRepoImpl }