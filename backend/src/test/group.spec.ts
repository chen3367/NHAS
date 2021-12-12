import { FastifyInstance } from 'fastify'
import { startFastify } from '../server'
import { Server, IncomingMessage, ServerResponse } from 'http'
import * as dbHandler from './db'
import { IGroup } from '../types/group'

describe('Group API test', () => {
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
      url: '/v1/groups',
      payload: {
          className: '21.11',
          groupName: 'WPTSD',
          groupLeader: '陳正豪'
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

  it('should successfully GET a list of group and GET one group', async () => {
    const response1 = await server.inject({ method: 'GET', url: '/v1/groups' })
    expect(response1.statusCode).toBe(200)

    const res1: { groups: Array<IGroup> } = JSON.parse(response1.body) 
    expect(res1.groups[0].className).toBe('21.11')
    expect(res1.groups[0].groupName).toBe('WPTSD')
    expect(res1.groups[0].groupLeader).toBe('陳正豪')

    const id = res1.groups[0]._id
    const response2 = await server.inject({ method: 'GET', url: `/v1/groups/${id}` })
    expect(response2.statusCode).toBe(200)

    const res2: { group: IGroup } = JSON.parse(response2.body)
    expect(res2.group.className).toBe('21.11')
    expect(res2.group.groupName).toBe('WPTSD')
    expect(res2.group.groupLeader).toBe('陳正豪')

  })

  it('should successfully POST a group to mongodb and can be found', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/v1/groups',
      payload: {
        className: '21.11',
        groupName: 'Tiger',
        groupLeader: 'Richard'
      }
    })
    expect(response.statusCode).toBe(201)
    
    const res: { group: IGroup } = JSON.parse(response.body)
    expect(res.group.className).toBe('21.11')
    expect(res.group.groupName).toBe('Tiger')
    expect(res.group.groupLeader).toBe('Richard')
  })

  it('should successfully PUT a group', async () => {
    const response1 = await server.inject({ method: 'GET', url: '/v1/groups'})
    const res1: { groups: Array<IGroup> } = JSON.parse(response1.body)
    const id = res1.groups[0]._id
    const response2 = await server.inject({
      method: 'PUT',
      url: `/v1/groups/${id}`,
      payload: {
        groupLeader: '蘇品瑜'
      }
    })
    expect(response2.statusCode).toBe(200)

    const res2: { group: IGroup } = JSON.parse(response2.body)
    expect(res2.group.className).toBe('21.11')
    expect(res2.group.groupName).toBe('WPTSD')
    expect(res2.group.groupLeader).toBe('蘇品瑜')
  })

  it('should successfully DELETE a group', async () => {
    const response1 = await server.inject({ method: 'GET', url: '/v1/groups'})
    const res1: { groups: Array<IGroup> } = JSON.parse(response1.body)
    const id = res1.groups[0]._id
    const response2 = await server.inject({ method: 'DELETE', url: `/v1/groups/${id}`})
    expect(response2.statusCode).toBe(204)
  })

  it('should return status code 400 when receiving invalid id', async () => {
    const id = 'invalid_id'
    const response1 = await server.inject({ method: 'GET', url: `/v1/groups/${id}`})
    const response2 = await server.inject({ method: 'PUT', url: `/v1/groups/${id}`})
    const response3 = await server.inject({ method: 'DELETE', url: `/v1/groups/${id}`})
    expect(response1.statusCode).toBe(400)
    expect(response2.statusCode).toBe(400)
    expect(response3.statusCode).toBe(400)
  })

  it('should return status code 404 when receiving id that does not exist', async () => {
    const response = await server.inject({ method: 'GET', url: '/v1/groups'})
    const res: { groups: Array<IGroup> } = JSON.parse(response.body)
    const id = res.groups[0]._id

    // delete
    await server.inject({ method: 'DELETE', url: `/v1/groups/${id}`})

    const response1 = await server.inject({ method: 'GET', url: `/v1/groups/${id}`})
    const response2 = await server.inject({ method: 'PUT', url: `/v1/groups/${id}`})
    const response3 = await server.inject({ method: 'DELETE', url: `/v1/groups/${id}`})
    expect(response1.statusCode).toBe(404)
    expect(response2.statusCode).toBe(404)
    expect(response3.statusCode).toBe(404)
  })
})