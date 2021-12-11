import { FastifyInstance, RouteShorthandOptions, FastifyReply } from 'fastify'
import { Params } from '../types/Params'
import { IGroupRollCall } from '../types/grouprollcall'
import { MemberRollCallRepoImpl } from '../repo/memberrollcall-repo'
import { GroupRollCallRepoImpl } from '../repo/grouprollcall-repo'
import { ClassRepoImpl } from '../repo/class-repo'
import { CourseRepoImpl } from '../repo/course-repo'

import { Types } from 'mongoose'
import { Type, Static } from '@sinclair/typebox'
import { INSPECT_MAX_BYTES } from 'buffer'

const GroupRollCallsResponse = Type.Object({
    grouprollcalls: Type.Array(
        Type.Object({
            _id: Type.String(),
            className: Type.String(),  
            date: Type.String(),
            courseName: Type.String(),
            groupName: Type.String(),
            groupStatus: Type.String(),
            createdAt: Type.String(),
            members: Type.Array(
                Type.Object({
                    eID: Type.String(),
                    memberName: Type.String(),
                    status: Type.String(),
                    reason: Type.String()
                })
            )
        })
    )
})

const GroupRollCallResponse = Type.Object({
    grouprollcall: Type.Object({
        _id: Type.String(),
        className: Type.String(),  
        date: Type.String(),
        courseName: Type.String(),
        groupName: Type.String(),
        groupStatus: Type.String(),
        createdAt: Type.String(),
        members: Type.Array(
            Type.Object({
                eID: Type.String(),
                memberName: Type.String(),
                status: Type.String(),
                reason: Type.String()
            })
        )
    })
})

type GroupRollCallsResponse = Static<typeof GroupRollCallsResponse>
type GroupRollCallResponse = Static<typeof GroupRollCallResponse>
 
const GroupRollCallRouter = (server: FastifyInstance, opts: RouteShorthandOptions, done: (error?: Error) => void) => { 

    server.get('/grouprollcalls', { ...opts, schema: { response: { 200: GroupRollCallsResponse } } }, async (request, reply) => {
        const grouprollcallRepo = GroupRollCallRepoImpl.of()
        try {
            const grouprollcalls = await grouprollcallRepo.getGroupRollCalls()
            console.log(grouprollcalls)
            return reply.status(200).send({ grouprollcalls })
        } catch (error) {
            return reply.status(500).send({ msg: `Internal Server Error: ${error}` })
        }
    })

    server.get<{ Params: Params }>('/grouprollcalls/:id', { ...opts, schema: { response: { 200: GroupRollCallResponse } } }, async (request, reply) => {
        const grouprollcallRepo = GroupRollCallRepoImpl.of()
        try {
            const id = request.params.id
            if (!Types.ObjectId.isValid(id)) {
                return reply.status(400).send({ msg: `Invalid id` })
            }
            const grouprollcall = await grouprollcallRepo.getGroupRollCall(id)
            if (grouprollcall) {
                return reply.status(200).send( { grouprollcall } )
            } else {
                return reply.status(404).send({ msg: `GroupRollCall #${id} Not Found` })
            }
        } catch (error) {
            return reply.status(500).send({ msg: error })
        }
    })

    server.get<{ Params: Params }>('/classes/:class_id/date/:date/courses/:course_id/grouprollcalls', { ...opts, schema: { response: { 200: GroupRollCallsResponse } } }, async (request, reply) => {
        const classRepo = ClassRepoImpl.of()
        const courseRepo = CourseRepoImpl.of()
        const grouprollcallRepo = GroupRollCallRepoImpl.of()
        const memberrollcallRepo = MemberRollCallRepoImpl.of()
        try {
            const class_id = request.params.class_id
            const course_id = request.params.course_id
            const date = request.params.date

            const classBody = await classRepo.getClass(class_id)
            const courseBody = await courseRepo.getCourse(course_id)

            const className = classBody?.className
            const courseName = courseBody?.courseName

            if (!Types.ObjectId.isValid(class_id)) {
                return reply.status(400).send({ msg: `Invalid id` })
            }
            
            const grouprollcalls = await grouprollcallRepo.getGroupRollCallsByParams(className!, date, courseName!)
            grouprollcalls!.forEach(async function(item) {
                const groupName = item.groupName
                const members = await memberrollcallRepo.getMemberRollCallsByParams(className!, date, courseName!, groupName)
            })

            if (grouprollcalls) {
                return reply.status(200).send( { grouprollcalls } )
            } else {
                return reply.status(404).send({ msg: `Class #${class_id} Not Found` })
            }
        } catch (error) {
            return reply.status(500).send({ msg: error })
        }
    })
 
    server.post<{ Body: IGroupRollCall }>('/grouprollcalls', async (request, reply) => {
        const grouprollcallRepo = GroupRollCallRepoImpl.of()
        try {
            const grouprollcallBody = request.body
            const grouprollcall = await grouprollcallRepo.addGroupRollCall(grouprollcallBody)
            return reply.status(201).send({ grouprollcall })
        } catch (error) {
            return reply.status(500).send({ msg: `Internal Server Error: ${error}` })
        }
    })

    server.put<{ Params: Params; Body: IGroupRollCall }>('/grouprollcalls/:id', async (request, reply) => {
        const grouprollcallRepo = GroupRollCallRepoImpl.of()
        try {
          const grouprollcallBody = request.body
          const id = request.params.id
          if (!Types.ObjectId.isValid(id)) {
              return reply.status(400).send({msg: `Invalid id`})
          }
          const grouprollcall = await grouprollcallRepo.updateGroupRollCall(id, grouprollcallBody)
          if (grouprollcall) {
              return reply.status(200).send({ grouprollcall })
          } else {
              return reply.status(404).send({msg: `GroupRollCall #${id} Not Found`})
          }
        } catch (error) {
          return reply.status(500).send({ msg: error })
        }
      })

    server.delete<{ Params: Params }>('/grouprollcalls/:id', async (request, reply) => {
        const grouprollcallRepo = GroupRollCallRepoImpl.of()
        try {
            const id = request.params.id
            if (!Types.ObjectId.isValid(id)) {
                return reply.status(400).send({ msg: `Invalid id` })
            }
            const grouprollcall = await grouprollcallRepo.deleteGroupRollCall(id)
            if (grouprollcall) {
                return reply.status(204).send()
            } else {
                return reply.status(404).send({ msg: `GroupRollCall #${id} Not Found` })
            }
        } catch (error) {
            return reply.status(500).send({ msg: error })
        }
    })
 
    done()
}
 
export { GroupRollCallRouter }