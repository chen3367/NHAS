import { FastifyInstance, RouteShorthandOptions, FastifyReply } from 'fastify'
import { Params } from '../types/Params'
import { IClass } from '../types/class'
import { ClassRepoImpl } from '../repo/class-repo'

import { Types } from 'mongoose'
import { Type, Static } from '@sinclair/typebox'

const ClassesResponse = Type.Object({
    classes: Type.Array(
        Type.Object({
            _id: Type.String(),           
            className: Type.String()
        })
    )
})

const ClassResponse = Type.Object({
    _class: Type.Object({
        _id: Type.String(),
        className: Type.String()
    })
})

type ClassesResponse = Static<typeof ClassesResponse>
type ClassResponse = Static<typeof ClassResponse>
 
const ClassRouter = (server: FastifyInstance, opts: RouteShorthandOptions, done: (error?: Error) => void) => { 

    server.get('/classes', { ...opts, schema: { response: { 200: ClassesResponse } } }, async (request, reply) => {
        const classRepo = ClassRepoImpl.of()
        try {
            const classes = await classRepo.getClasses()
            return reply.status(200).send({ classes })
        } catch (error) {
            return reply.status(500).send({ msg: `Internal Server Error: ${error}` })
        }
    })

    server.get<{ Params: Params }>('/classes/:class_id', { ...opts, schema: { response: { 200: ClassResponse } } }, async (request, reply) => {
        const classRepo = ClassRepoImpl.of()
        try {
            const class_id = request.params.class_id
            if (!Types.ObjectId.isValid(class_id)) {
                return reply.status(400).send({ msg: `Invalid id` })
            }
            const _class = await classRepo.getClass(class_id)
            if (_class) {
                return reply.status(200).send( { _class } )
            } else {
                return reply.status(404).send({ msg: `Class #${class_id} Not Found` })
            }
        } catch (error) {
            return reply.status(500).send({ msg: error })
        }
    })
 
    server.post<{ Body: IClass }>('/classes', async (request, reply) => {
        const classRepo = ClassRepoImpl.of()
        try {
            const classBody = request.body
            const _class = await classRepo.addClass(classBody)
            return reply.status(201).send({ _class })
        } catch (error) {
            return reply.status(500).send({ msg: `Internal Server Error: ${error}` })
        }
    })

    server.put<{ Params: Params; Body: IClass }>('/classes/:class_id', async (request, reply) => {
        const classRepo = ClassRepoImpl.of()
        try {
          const classBody = request.body
          const class_id = request.params.class_id
          if (!Types.ObjectId.isValid(class_id)) {
              return reply.status(400).send({msg: `Invalid id`})
          }
          const _class = await classRepo.updateClass(class_id, classBody)
          if (_class) {
              return reply.status(200).send({ _class })
          } else {
              return reply.status(404).send({msg: `Class #${class_id} Not Found`})
          }
        } catch (error) {
          return reply.status(500).send({ msg: error })
        }
      })

    server.delete<{ Params: Params }>('/classes/:class_id', async (request, reply) => {
        const classRepo = ClassRepoImpl.of()
        try {
            const class_id = request.params.class_id
            if (!Types.ObjectId.isValid(class_id)) {
                return reply.status(400).send({ msg: `Invalid id` })
            }
            const _class = await classRepo.deleteClass(class_id)
            if (_class) {
                return reply.status(204).send()
            } else {
                return reply.status(404).send({ msg: `Class #${class_id} Not Found` })
            }
        } catch (error) {
            return reply.status(500).send({ msg: error })
        }
    })
 
    done()
}
 
export { ClassRouter }