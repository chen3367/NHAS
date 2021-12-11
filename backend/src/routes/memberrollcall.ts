import { FastifyInstance, RouteShorthandOptions, FastifyReply } from 'fastify'
import { Params } from '../types/Params'
import { IMemberRollCall } from '../types/memberrollcall'
import { ClassRepoImpl } from '../repo/class-repo'
import { CourseRepoImpl } from '../repo/course-repo'
import { GroupRepoImpl } from '../repo/group-repo'
import { MemberRollCallRepoImpl } from '../repo/memberrollcall-repo'

import { Types } from 'mongoose'
import { Type, Static } from '@sinclair/typebox'

const MemberRollCallsResponse = Type.Object({
    memberrollcalls: Type.Array(
        Type.Object({
            _id: Type.String(),
            className: Type.String(),  
            date: Type.String(),
            courseName: Type.String(),
            groupName: Type.String(),
            eID: Type.String(),
            memberName: Type.String(),
            status: Type.String(),
            reason: Type.String()
        })
    )
})

const MemberRollCallResponse = Type.Object({
    memberrollcall: Type.Object({
        _id: Type.String(),
        className: Type.String(),  
        date: Type.String(),
        courseName: Type.String(),
        groupName: Type.String(),
        eID: Type.String(),
        memberName: Type.String(),
        status: Type.String(),
        reason: Type.String()
    })
})

type MemberRollCallsResponse = Static<typeof MemberRollCallsResponse>
type MemberRollCallResponse = Static<typeof MemberRollCallResponse>
 
const MemberRollCallRouter = (server: FastifyInstance, opts: RouteShorthandOptions, done: (error?: Error) => void) => { 

    server.get('/memberrollcalls', { ...opts, schema: { response: { 200: MemberRollCallsResponse } } }, async (request, reply) => {
        const memberrollcallRepo = MemberRollCallRepoImpl.of()
        try {
            const memberrollcalls = await memberrollcallRepo.getMemberRollCalls()
            return reply.status(200).send({ memberrollcalls })
        } catch (error) {
            return reply.status(500).send({ msg: `Internal Server Error: ${error}` })
        }
    })

    server.get<{ Params: Params }>('/memberrollcalls/:id', { ...opts, schema: { response: { 200: MemberRollCallResponse } } }, async (request, reply) => {
        const memberrollcallRepo = MemberRollCallRepoImpl.of()
        try {
            const id = request.params.id
            if (!Types.ObjectId.isValid(id)) {
                return reply.status(400).send({ msg: `Invalid id` })
            }
            const memberrollcall = await memberrollcallRepo.getMemberRollCall(id)
            if (memberrollcall) {
                return reply.status(200).send( { memberrollcall } )
            } else {
                return reply.status(404).send({ msg: `MemberRollCall #${id} Not Found` })
            }
        } catch (error) {
            return reply.status(500).send({ msg: error })
        }
    })

    server.get<{ Params: Params }>('/classes/:class_id/date/:date/courses/:course_id/groups/:group_id/memberrollcalls', { ...opts, schema: { response: { 200: MemberRollCallsResponse } } }, async (request, reply) => {
        const classRepo = ClassRepoImpl.of()
        const courseRepo = CourseRepoImpl.of()
        const groupRepo = GroupRepoImpl.of()
        const memberrollcallRepo = MemberRollCallRepoImpl.of()
        try {
            const class_id = request.params.class_id
            const date = request.params.date
            const course_id = request.params.course_id
            const group_id = request.params.group_id

            const classBody = await classRepo.getClass(class_id)
            const courseBody = await courseRepo.getCourse(course_id)
            const groupBody = await groupRepo.getGroup(group_id)

            const className = classBody?.className
            const courseName = courseBody?.courseName
            const groupName = groupBody?.groupName

            if (!Types.ObjectId.isValid(class_id)) {
                return reply.status(400).send({ msg: `Invalid id` })
            }
            const memberrollcalls = await memberrollcallRepo.getMemberRollCallsByParams(className!, date, courseName!, groupName!)

            if (memberrollcalls) {
                return reply.status(200).send( { memberrollcalls } )
            } else {
                return reply.status(404).send({ msg: `Class #${class_id} Not Found` })
            }
        } catch (error) {
            return reply.status(500).send({ msg: error })
        }
    })
 
    server.post<{ Body: IMemberRollCall }>('/memberrollcalls', async (request, reply) => {
        const memberrollcallRepo = MemberRollCallRepoImpl.of()
        try {
            const memberrollcallBody = request.body
            const memberrollcall = await memberrollcallRepo.addMemberRollCall(memberrollcallBody)
            console.log(memberrollcall)
            return reply.status(201).send({ memberrollcall })
        } catch (error) {
            return reply.status(500).send({ msg: `Internal Server Error: ${error}` })
        }
    })

    server.put<{ Params: Params; Body: IMemberRollCall }>('/memberrollcalls/:id', async (request, reply) => {
        const memberrollcallRepo = MemberRollCallRepoImpl.of()
        try {
          const memberrollcallBody = request.body
          const id = request.params.id
          if (!Types.ObjectId.isValid(id)) {
              return reply.status(400).send({msg: `Invalid id`})
          }
          const memberrollcall = await memberrollcallRepo.updateMemberRollCall(id, memberrollcallBody)
          if (memberrollcall) {
              return reply.status(200).send({ memberrollcall })
          } else {
              return reply.status(404).send({msg: `MemberRollCall #${id} Not Found`})
          }
        } catch (error) {
          return reply.status(500).send({ msg: error })
        }
      })

    server.delete<{ Params: Params }>('/memberrollcalls/:id', async (request, reply) => {
        const memberrollcallRepo = MemberRollCallRepoImpl.of()
        try {
            const id = request.params.id
            if (!Types.ObjectId.isValid(id)) {
                return reply.status(400).send({ msg: `Invalid id` })
            }
            const memberrollcall = await memberrollcallRepo.deleteMemberRollCall(id)
            if (memberrollcall) {
                return reply.status(204).send()
            } else {
                return reply.status(404).send({ msg: `MemberRollCall #${id} Not Found` })
            }
        } catch (error) {
            return reply.status(500).send({ msg: error })
        }
    })
 
    done()
}
 
export { MemberRollCallRouter }