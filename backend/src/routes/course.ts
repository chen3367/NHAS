import { FastifyInstance, RouteShorthandOptions, FastifyReply } from 'fastify'
import { Params } from '../types/Params'
import { ICourse } from '../types/course'
import { ClassRepoImpl } from '../repo/class-repo'
import { CourseRepoImpl } from '../repo/course-repo'

import { Types } from 'mongoose'
import { Type, Static } from '@sinclair/typebox'

const CoursesResponse = Type.Object({
    courses: Type.Array(
        Type.Object({
            _id: Type.String(),
            className: Type.String(),  
            date: Type.String(),
            courseName: Type.String(),
            lecturer: Type.String(),
            startTime: Type.String(),
            endTime: Type.String()
        })
    )
})

const CourseResponse = Type.Object({
    course: Type.Object({
        _id: Type.String(),
        className: Type.String(),  
        date: Type.String(),
        courseName: Type.String(),
        lecturer: Type.String(),
        startTime: Type.String(),
        endTime: Type.String()
    })
})

type CoursesResponse = Static<typeof CoursesResponse>
type CourseResponse = Static<typeof CourseResponse>
 
const CourseRouter = (server: FastifyInstance, opts: RouteShorthandOptions, done: (error?: Error) => void) => { 

    server.get('/courses', { ...opts, schema: { response: { 200: CoursesResponse } } }, async (request, reply) => {
        const courseRepo = CourseRepoImpl.of()
        try {
            const courses = await courseRepo.getCourses()
            return reply.status(200).send({ courses })
        } catch (error) {
            return reply.status(500).send({ msg: `Internal Server Error: ${error}` })
        }
    })

    server.get<{ Params: Params }>('/courses/:course_id', { ...opts, schema: { response: { 200: CourseResponse } } }, async (request, reply) => {
        const courseRepo = CourseRepoImpl.of()
        try {
            const course_id = request.params.course_id
            if (!Types.ObjectId.isValid(course_id)) {
                return reply.status(400).send({ msg: `Invalid id` })
            }
            const course = await courseRepo.getCourse(course_id)
            if (course) {
                return reply.status(200).send( { course } )
            } else {
                return reply.status(404).send({ msg: `Course #${course_id} Not Found` })
            }
        } catch (error) {
            return reply.status(500).send({ msg: error })
        }
    })

    server.get<{ Params: Params }>('/classes/:class_id/courses', { ...opts, schema: { response: { 200: CoursesResponse } } }, async (request, reply) => {
        const classRepo = ClassRepoImpl.of()
        const courseRepo = CourseRepoImpl.of()
        try {
            const class_id = request.params.class_id
            const classBody = await classRepo.getClass(class_id)
            const className = classBody?.className
            if (!Types.ObjectId.isValid(class_id)) {
                return reply.status(400).send({ msg: `Invalid id` })
            }
            const courses = await courseRepo.getCoursesByClass(className!)
            if (courses) {
                return reply.status(200).send( { courses } )
            } else {
                return reply.status(404).send({ msg: `Class #${class_id} Not Found` })
            }
        } catch (error) {
            return reply.status(500).send({ msg: error })
        }
    })

    server.get<{ Params: Params }>('/classes/:class_id/date/:date/courses', { ...opts, schema: { response: { 200: CoursesResponse } } }, async (request, reply) => {
        const classRepo = ClassRepoImpl.of()
        const courseRepo = CourseRepoImpl.of()
        try {
            const class_id = request.params.class_id
            const date = request.params.date
            const classBody = await classRepo.getClass(class_id)
            const className = classBody?.className
            if (!Types.ObjectId.isValid(class_id)) {
                return reply.status(400).send({ msg: `Invalid id` })
            }
            const courses = await courseRepo.getCoursesByParams(className!, date)
            if (courses) {
                return reply.status(200).send( { courses } )
            } else {
                return reply.status(404).send({ msg: `Class #${class_id} Not Found` })
            }
        } catch (error) {
            return reply.status(500).send({ msg: error })
        }
    })
 
    server.post<{ Body: ICourse }>('/courses', async (request, reply) => {
        const courseRepo = CourseRepoImpl.of()
        try {
            const courseBody = request.body
            const course = await courseRepo.addCourse(courseBody)
            return reply.status(201).send({ course })
        } catch (error) {
            return reply.status(500).send({ msg: `Internal Server Error: ${error}` })
        }
    })

    server.put<{ Params: Params; Body: ICourse }>('/courses/:course_id', async (request, reply) => {
        const courseRepo = CourseRepoImpl.of()
        try {
          const courseBody = request.body
          const course_id = request.params.course_id
          if (!Types.ObjectId.isValid(course_id)) {
              return reply.status(400).send({msg: `Invalid id`})
          }
          const course = await courseRepo.updateCourse(course_id, courseBody)
          if (course) {
              return reply.status(200).send({ course })
          } else {
              return reply.status(404).send({msg: `Course #${course_id} Not Found`})
          }
        } catch (error) {
          return reply.status(500).send({ msg: error })
        }
      })

    server.delete<{ Params: Params }>('/courses/:course_id', async (request, reply) => {
        const courseRepo = CourseRepoImpl.of()
        try {
            const course_id = request.params.course_id
            if (!Types.ObjectId.isValid(course_id)) {
                return reply.status(400).send({ msg: `Invalid id` })
            }
            const course = await courseRepo.deleteCourse(course_id)
            if (course) {
                return reply.status(204).send()
            } else {
                return reply.status(404).send({ msg: `Course #${course_id} Not Found` })
            }
        } catch (error) {
            return reply.status(500).send({ msg: error })
        }
    })
 
    done()
}
 
export { CourseRouter }