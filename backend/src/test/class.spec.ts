import { FastifyInstance } from 'fastify'
import { startFastify } from '../server'
import { Server, IncomingMessage, ServerResponse } from 'http'
import * as dbHandler from './db'
import { IClass } from '../types/class'

describe('Class API test', () => {
  let server: FastifyInstance<Server, IncomingMessage, ServerResponse>
  const fastifyPort = 8888

  beforeAll(async () => {
    await dbHandler.connect()
    server = startFastify(fastifyPort)
    await server.ready()
  })

  beforeEach(async () => {
    await server.inject({
      method: 'POST',
      url: '/v1/classes',
      payload: {
        className: '21.11'
      }
    })
  })

  afterEach(async () => {
    await dbHandler.clearDatabase()
  })

  afterAll(async () => {
    await dbHandler.closeDatabase()
    await server.close()
    console.log('Closing Fastify server is done!')
  })

  it('should successfully GET a list of class and GET one class', async () => {
    const response1 = await server.inject({ method: 'GET', url: '/v1/classes' })
    expect(response1.statusCode).toBe(200)

    const res1: { classes: Array<IClass> } = JSON.parse(response1.body) 
    expect(res1.classes[0].className).toBe('21.11')

    const id = res1.classes[0]._id
    const response2 = await server.inject({ method: 'GET', url: `/v1/classes/${id}` })
    expect(response2.statusCode).toBe(200)

    const res2: { _class: IClass } = JSON.parse(response2.body)
    expect(res2._class.className).toBe('21.11')

  })

  it('should successfully POST a class to mongodb and can be found', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/v1/classes',
      payload: {
        className: '21.12'
      }
    })
    expect(response.statusCode).toBe(201)
    
    const res: { _class: IClass } = JSON.parse(response.body)
    expect(res._class.className).toBe('21.12')
  })

  it('should successfully PUT a class', async () => {
    const response1 = await server.inject({ method: 'GET', url: '/v1/classes'})
    const res1: { classes: Array<IClass> } = JSON.parse(response1.body)
    const id = res1.classes[0]._id
    const response2 = await server.inject({
      method: 'PUT',
      url: `/v1/classes/${id}`,
      payload: {
        className: '21.10'
      }
    })
    expect(response2.statusCode).toBe(200)

    const res2: { _class: IClass } = JSON.parse(response2.body)
    expect(res2._class.className).toBe('21.10')
  })

  it('should successfully DELETE a class', async () => {
    const response1 = await server.inject({ method: 'GET', url: '/v1/classes'})
    const res1: { classes: Array<IClass> } = JSON.parse(response1.body)
    const id = res1.classes[0]._id
    const response2 = await server.inject({ method: 'DELETE', url: `/v1/classes/${id}`})
    expect(response2.statusCode).toBe(204)
  })

  it('should return status code 400 when receiving invalid id', async () => {
    const id = 'invalid_id'
    const response1 = await server.inject({ method: 'GET', url: `/v1/classes/${id}`})
    const response2 = await server.inject({ method: 'PUT', url: `/v1/classes/${id}`})
    const response3 = await server.inject({ method: 'DELETE', url: `/v1/classes/${id}`})
    expect(response1.statusCode).toBe(400)
    expect(response2.statusCode).toBe(400)
    expect(response3.statusCode).toBe(400)
  })

  it('should return status code 404 when receiving id that does not exist', async () => {
    const response = await server.inject({ method: 'GET', url: '/v1/classes'})
    const res: { classes: Array<IClass> } = JSON.parse(response.body)
    const id = res.classes[0]._id

    // delete
    await server.inject({ method: 'DELETE', url: `/v1/classes/${id}`})

    const response1 = await server.inject({ method: 'GET', url: `/v1/classes/${id}`})
    const response2 = await server.inject({ method: 'PUT', url: `/v1/classes/${id}`})
    const response3 = await server.inject({ method: 'DELETE', url: `/v1/classes/${id}`})
    expect(response1.statusCode).toBe(404)
    expect(response2.statusCode).toBe(404)
    expect(response3.statusCode).toBe(404)
  })
})