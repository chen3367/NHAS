import { FastifyInstance } from 'fastify'
import { startFastify } from '../server'
import { Server, IncomingMessage, ServerResponse } from 'http'
import * as dbHandler from './db'
import { IGroupRollCall } from '../types/grouprollcall'

describe('GroupRollCall API test', () => {
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
      url: '/v1/grouprollcalls',
      payload: {
        className: '21.11',
        date: '20211201',
        courseName: 'User Story',
        groupName: 'WPTSD',
        groupStatus: 'grey',
        members: [{
          eID: '126172',
          memberName: '陳正豪',
          status: 'grey',
          reason: ''
        }]
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

  it('should successfully GET a list of grouprollcall and GET one grouprollcall', async () => {
    const response1 = await server.inject({ method: 'GET', url: '/v1/grouprollcalls' })
    expect(response1.statusCode).toBe(200)

    const res1: { grouprollcalls: Array<IGroupRollCall> } = JSON.parse(response1.body) 
    expect(res1.grouprollcalls[0].className).toBe('21.11')
    expect(res1.grouprollcalls[0].date).toBe('20211201')
    expect(res1.grouprollcalls[0].courseName).toBe('User Story')
    expect(res1.grouprollcalls[0].groupName).toBe('WPTSD')
    expect(res1.grouprollcalls[0].groupStatus).toBe('grey')
    expect(res1.grouprollcalls[0].members[0].eID).toBe('126172')
    expect(res1.grouprollcalls[0].members[0].memberName).toBe('陳正豪')
    expect(res1.grouprollcalls[0].members[0].status).toBe('grey')
    expect(res1.grouprollcalls[0].members[0].reason).toBe('')

    const id = res1.grouprollcalls[0]._id
    const response2 = await server.inject({ method: 'GET', url: `/v1/grouprollcalls/${id}` })
    expect(response2.statusCode).toBe(200)

    const res2: { grouprollcall: IGroupRollCall } = JSON.parse(response2.body) 
    expect(res2.grouprollcall.className).toBe('21.11')
    expect(res2.grouprollcall.date).toBe('20211201')
    expect(res2.grouprollcall.courseName).toBe('User Story')
    expect(res2.grouprollcall.groupName).toBe('WPTSD')
    expect(res2.grouprollcall.groupStatus).toBe('grey')
    expect(res2.grouprollcall.members[0].eID).toBe('126172')
    expect(res2.grouprollcall.members[0].memberName).toBe('陳正豪')
    expect(res2.grouprollcall.members[0].status).toBe('grey')
    expect(res2.grouprollcall.members[0].reason).toBe('')

    // GET groups roll call by parameters
    const classResponse = await server.inject({ 
      method: 'POST',
      url: '/v1/classes',
      payload: {
        className: '21.11'
      }
    })

    const courseResponse = await server.inject({ 
      method: 'POST',
      url: '/v1/courses',
      payload: {
        courseName: 'User Story'
      }
    })

    const class_id = JSON.parse(classResponse.body)._class._id
    const course_id = JSON.parse(courseResponse.body).course._id

    const response3 = await server.inject({ method: 'GET', url: `/v1/classes/${class_id}/date/20211201/courses/${course_id}/grouprollcalls` })
    expect(response3.statusCode).toBe(200)
    
    const res3: { grouprollcalls: Array<IGroupRollCall> } = JSON.parse(response3.body) 
    expect(res3.grouprollcalls[0].className).toBe('21.11')
    expect(res3.grouprollcalls[0].date).toBe('20211201')
    expect(res3.grouprollcalls[0].courseName).toBe('User Story')
    expect(res3.grouprollcalls[0].groupName).toBe('WPTSD')
    expect(res3.grouprollcalls[0].groupStatus).toBe('grey')
  })

  it('should successfully POST a grouprollcall to mongodb and can be found', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/v1/grouprollcalls',
      payload: {
        className: '21.11',
        date: '20211201',
        courseName: 'User Story',
        groupName: 'Tiger',
        groupStatus: 'grey',
        members: [{
          eID: '130001',
          memberName: 'Richard',
          status: 'grey',
          reason: ''
        }]
      }
    })
    expect(response.statusCode).toBe(201)
    
    const res: { grouprollcall: IGroupRollCall } = JSON.parse(response.body)
    expect(res.grouprollcall.className).toBe('21.11')
    expect(res.grouprollcall.date).toBe('20211201')
    expect(res.grouprollcall.courseName).toBe('User Story')
    expect(res.grouprollcall.groupName).toBe('Tiger')
    expect(res.grouprollcall.groupStatus).toBe('grey')
    expect(res.grouprollcall.members[0].eID).toBe('130001')
    expect(res.grouprollcall.members[0].memberName).toBe('Richard')
    expect(res.grouprollcall.members[0].status).toBe('grey')
    expect(res.grouprollcall.members[0].reason).toBe('')
  })

  it('should successfully PUT a grouprollcall', async () => {
    const response1 = await server.inject({ method: 'GET', url: '/v1/grouprollcalls'})
    const res1: { grouprollcalls: Array<IGroupRollCall> } = JSON.parse(response1.body)
    const id = res1.grouprollcalls[0]._id
    const response2 = await server.inject({
      method: 'PUT',
      url: `/v1/grouprollcalls/${id}`,
      payload: {
        groupStatus: 'green'
      }
    })
    expect(response2.statusCode).toBe(200)

    const res2: { grouprollcall: IGroupRollCall } = JSON.parse(response2.body)
    expect(res2.grouprollcall.groupStatus).toBe('green')
  })

  it('should successfully DELETE a grouprollcall', async () => {
    const response1 = await server.inject({ method: 'GET', url: '/v1/grouprollcalls'})
    const res1: { grouprollcalls: Array<IGroupRollCall> } = JSON.parse(response1.body)
    const id = res1.grouprollcalls[0]._id
    const response2 = await server.inject({ method: 'DELETE', url: `/v1/grouprollcalls/${id}`})
    expect(response2.statusCode).toBe(204)
  })

  it('should return status code 400 when receiving invalid id', async () => {
    const id = 'invalid_id'
    const response1 = await server.inject({ method: 'GET', url: `/v1/grouprollcalls/${id}`})
    const response2 = await server.inject({ method: 'PUT', url: `/v1/grouprollcalls/${id}`})
    const response3 = await server.inject({ method: 'DELETE', url: `/v1/grouprollcalls/${id}`})
    const response4 = await server.inject({ method: 'GET', url: `/v1/classes/${id}/date/20211201/courses/${id}/grouprollcalls` })
    expect(response1.statusCode).toBe(400)
    expect(response2.statusCode).toBe(400)
    expect(response3.statusCode).toBe(400)
    expect(response4.statusCode).toBe(400)
  })

  it('should return status code 404 when receiving id that does not exist', async () => {
    const response = await server.inject({ method: 'GET', url: '/v1/grouprollcalls'})
    const res: { grouprollcalls: Array<IGroupRollCall> } = JSON.parse(response.body)
    const id = res.grouprollcalls[0]._id

    // delete
    await server.inject({ method: 'DELETE', url: `/v1/grouprollcalls/${id}`})

    const response1 = await server.inject({ method: 'GET', url: `/v1/grouprollcalls/${id}`})
    const response2 = await server.inject({ method: 'PUT', url: `/v1/grouprollcalls/${id}`})
    const response3 = await server.inject({ method: 'DELETE', url: `/v1/grouprollcalls/${id}`})
    const response4 = await server.inject({ method: 'GET', url: `/v1/classes/${id}/date/20211201/courses/${id}/grouprollcalls` })
    expect(response1.statusCode).toBe(404)
    expect(response2.statusCode).toBe(404)
    expect(response3.statusCode).toBe(404)
    expect(response4.statusCode).toBe(404)
  })
})