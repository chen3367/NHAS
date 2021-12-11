import { FastifyInstance, RouteShorthandOptions, FastifyReply } from 'fastify'
import { Params } from '../types/Params'
import { IGroup } from '../types/group'
import { GroupRepoImpl } from '../repo/group-repo'

import { Types } from 'mongoose'
import { Type, Static } from '@sinclair/typebox'

const GroupsResponse = Type.Object({
    groups: Type.Array(
        Type.Object({
            _id: Type.String(),
            className: Type.String(),  
            groupName: Type.String(),
            groupLeader: Type.String()
        })
    )
})

const GroupResponse = Type.Object({
    group: Type.Object({
        _id: Type.String(),
        className: Type.String(),  
        groupName: Type.String(),
        groupLeader: Type.String()
    })
})

type GroupsResponse = Static<typeof GroupsResponse>
type GroupResponse = Static<typeof GroupResponse>
 
const GroupRouter = (server: FastifyInstance, opts: RouteShorthandOptions, done: (error?: Error) => void) => { 

    server.get('/groups', { ...opts, schema: { response: { 200: GroupsResponse } } }, async (request, reply) => {
        const groupRepo = GroupRepoImpl.of()
        try {
            const groups = await groupRepo.getGroups()
            return reply.status(200).send({ groups })
        } catch (error) {
            return reply.status(500).send({ msg: `Internal Server Error: ${error}` })
        }
    })

    server.get<{ Params: Params }>('/groups/:group_id', { ...opts, schema: { response: { 200: GroupResponse } } }, async (request, reply) => {
        const groupRepo = GroupRepoImpl.of()
        try {
            const group_id = request.params.group_id
            if (!Types.ObjectId.isValid(group_id)) {
                return reply.status(400).send({ msg: `Invalid id` })
            }
            const group = await groupRepo.getGroup(group_id)
            if (group) {
                return reply.status(200).send( { group } )
            } else {
                return reply.status(404).send({ msg: `Group #${group_id} Not Found` })
            }
        } catch (error) {
            return reply.status(500).send({ msg: error })
        }
    })
 
    server.post<{ Body: IGroup }>('/groups', async (request, reply) => {
        const groupRepo = GroupRepoImpl.of()
        try {
            const groupBody = request.body
            const group = await groupRepo.addGroup(groupBody)
            return reply.status(201).send({ group })
        } catch (error) {
            return reply.status(500).send({ msg: `Internal Server Error: ${error}` })
        }
    })

    server.put<{ Params: Params; Body: IGroup }>('/groups/:group_id', async (request, reply) => {
        const groupRepo = GroupRepoImpl.of()
        try {
          const groupBody = request.body
          const group_id = request.params.group_id
          if (!Types.ObjectId.isValid(group_id)) {
              return reply.status(400).send({msg: `Invalid id`})
          }
          const group = await groupRepo.updateGroup(group_id, groupBody)
          if (group) {
              return reply.status(200).send({ group })
          } else {
              return reply.status(404).send({msg: `Group #${group_id} Not Found`})
          }
        } catch (error) {
          return reply.status(500).send({ msg: error })
        }
      })

    server.delete<{ Params: Params }>('/groups/:group_id', async (request, reply) => {
        const groupRepo = GroupRepoImpl.of()
        try {
            const group_id = request.params.group_id
            if (!Types.ObjectId.isValid(group_id)) {
                return reply.status(400).send({ msg: `Invalid id` })
            }
            const group = await groupRepo.deleteGroup(group_id)
            if (group) {
                return reply.status(204).send()
            } else {
                return reply.status(404).send({ msg: `Group #${group_id} Not Found` })
            }
        } catch (error) {
            return reply.status(500).send({ msg: error })
        }
    })
 
    done()
}
 
export { GroupRouter }