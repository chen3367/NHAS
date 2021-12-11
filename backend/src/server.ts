import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import { establishConnection } from './plugins/mongoose'
import { ClassRouter} from './routes/class'
import { CourseRouter} from './routes/course'
import { GroupRouter} from './routes/group'
import { MemberRollCallRouter} from './routes/memberrollcall'
import { GroupRollCallRouter} from './routes/grouprollcall'
 
const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({
    logger: { prettyPrint: true }
})

const startFastify: (port: number) => FastifyInstance<Server, IncomingMessage, ServerResponse> = (port) => {
 
    server.listen(port, '0.0.0.0', (err, _) => {
        if (err) {
            console.error(err)
        }
        establishConnection()
    })
 
    server.get('/ping', async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.status(200).send({ msg: 'pong' })
    })

    server.register(ClassRouter, { prefix: '/v1' })
    server.register(CourseRouter, { prefix: '/v1' })
    server.register(GroupRouter, { prefix: '/v1' })
    server.register(MemberRollCallRouter, { prefix: '/v1' })
    server.register(GroupRollCallRouter, { prefix: '/v1' })
 
    return server
}
 
export { startFastify }