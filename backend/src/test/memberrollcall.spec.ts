import { FastifyInstance } from 'fastify'
import { startFastify } from '../server'
import { Server, IncomingMessage, ServerResponse } from 'http'
import * as dbHandler from './db'
import { IMemberRollCall } from '../types/memberrollcall'

describe('MemberRollCall API test', () => {
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
      url: '/v1/memberrollcalls',
      payload: {
        className: '21.11',
        date: '20211201',
        courseName: 'User Story',
        groupName: 'WPTSD',
        eID: '126172',
        memberName: '陳正豪',
        status: 'red',
        reason: '睡過頭'
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

  it('should successfully GET a list of memberrollcall and GET one memberrollcall', async () => {
    const response1 = await server.inject({ method: 'GET', url: '/v1/memberrollcalls' })
    expect(response1.statusCode).toBe(200)

    const res1: { memberrollcalls: Array<IMemberRollCall> } = JSON.parse(response1.body) 
    expect(res1.memberrollcalls[0].className).toBe('21.11')
    expect(res1.memberrollcalls[0].date).toBe('20211201')
    expect(res1.memberrollcalls[0].courseName).toBe('User Story')
    expect(res1.memberrollcalls[0].groupName).toBe('WPTSD')
    expect(res1.memberrollcalls[0].eID).toBe('126172')
    expect(res1.memberrollcalls[0].memberName).toBe('陳正豪')
    expect(res1.memberrollcalls[0].status).toBe('red')
    expect(res1.memberrollcalls[0].reason).toBe('睡過頭')

    const id = res1.memberrollcalls[0]._id
    const response2 = await server.inject({ method: 'GET', url: `/v1/memberrollcalls/${id}` })
    expect(response2.statusCode).toBe(200)

    const res2: { memberrollcall: IMemberRollCall } = JSON.parse(response2.body) 
    expect(res2.memberrollcall.className).toBe('21.11')
    expect(res2.memberrollcall.date).toBe('20211201')
    expect(res2.memberrollcall.courseName).toBe('User Story')
    expect(res2.memberrollcall.groupName).toBe('WPTSD')
    expect(res2.memberrollcall.eID).toBe('126172')
    expect(res2.memberrollcall.memberName).toBe('陳正豪')
    expect(res2.memberrollcall.status).toBe('red')
    expect(res2.memberrollcall.reason).toBe('睡過頭')

    // GET groups by parameters
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

    const groupResponse = await server.inject({ 
      method: 'POST',
      url: '/v1/groups',
      payload: {
        groupName: 'WPTSD'
      }
    })

    const class_id = JSON.parse(classResponse.body)._class._id
    const course_id = JSON.parse(courseResponse.body).course._id
    const group_id = JSON.parse(groupResponse.body).group._id

    const response3 = await server.inject({ method: 'GET', url: `/v1/classes/${class_id}/date/20211201/courses/${course_id}/groups/${group_id}/memberrollcalls` })
    expect(response3.statusCode).toBe(200)
    const res3: { memberrollcalls: Array<IMemberRollCall> } = JSON.parse(response3.body)
    expect(res3.memberrollcalls[0].className).toBe('21.11')
    expect(res3.memberrollcalls[0].date).toBe('20211201')
    expect(res3.memberrollcalls[0].courseName).toBe('User Story')
    expect(res3.memberrollcalls[0].groupName).toBe('WPTSD')
    expect(res3.memberrollcalls[0].eID).toBe('126172')
    expect(res3.memberrollcalls[0].memberName).toBe('陳正豪')
    expect(res3.memberrollcalls[0].status).toBe('red')
    expect(res3.memberrollcalls[0].reason).toBe('睡過頭')

  })

  it('should successfully POST a memberrollcall to mongodb and can be found', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/v1/memberrollcalls',
      payload: {
        className: '21.11',
        date: '20211201',
        courseName: 'UI/UX',
        groupName: 'WPTSD',
        eID: '126172',
        memberName: '陳正豪',
        status: 'red',
        reason: '睡過頭'
      }
    })
    expect(response.statusCode).toBe(201)
    
    const res: { memberrollcall: IMemberRollCall } = JSON.parse(response.body)
    expect(res.memberrollcall.className).toBe('21.11')
    expect(res.memberrollcall.date).toBe('20211201')
    expect(res.memberrollcall.courseName).toBe('UI/UX')
    expect(res.memberrollcall.groupName).toBe('WPTSD')
    expect(res.memberrollcall.eID).toBe('126172')
    expect(res.memberrollcall.memberName).toBe('陳正豪')
    expect(res.memberrollcall.status).toBe('red')
    expect(res.memberrollcall.reason).toBe('睡過頭')
  })

  it('should successfully PUT a memberrollcall', async () => {
    const response1 = await server.inject({ method: 'GET', url: '/v1/memberrollcalls'})
    const res1: { memberrollcalls: Array<IMemberRollCall> } = JSON.parse(response1.body)
    const id = res1.memberrollcalls[0]._id
    const response2 = await server.inject({
      method: 'PUT',
      url: `/v1/memberrollcalls/${id}`,
      payload: {
        status: 'green'
      }
    })
    expect(response2.statusCode).toBe(200)

    const res2: { memberrollcall: IMemberRollCall } = JSON.parse(response2.body)
    expect(res2.memberrollcall.status).toBe('green')
  })

  it('should successfully DELETE a memberrollcall', async () => {
    const response1 = await server.inject({ method: 'GET', url: '/v1/memberrollcalls'})
    const res1: { memberrollcalls: Array<IMemberRollCall> } = JSON.parse(response1.body)
    const id = res1.memberrollcalls[0]._id
    const response2 = await server.inject({ method: 'DELETE', url: `/v1/memberrollcalls/${id}`})
    expect(response2.statusCode).toBe(204)
  })

  it('should return status code 400 when receiving invalid id', async () => {
    const id = 'invalid_id'
    const response1 = await server.inject({ method: 'GET', url: `/v1/memberrollcalls/${id}`})
    const response2 = await server.inject({ method: 'PUT', url: `/v1/memberrollcalls/${id}`})
    const response3 = await server.inject({ method: 'DELETE', url: `/v1/memberrollcalls/${id}`})
    const response4 = await server.inject({ method: 'GET', url: `/v1/classes/${id}/date/20211201/courses/${id}/groups/${id}/memberrollcalls`})
    expect(response1.statusCode).toBe(400)
    expect(response2.statusCode).toBe(400)
    expect(response3.statusCode).toBe(400)
    expect(response4.statusCode).toBe(400)
  })

  it('should return status code 404 when receiving id that does not exist', async () => {
    const response = await server.inject({ method: 'GET', url: '/v1/memberrollcalls'})
    const res: { memberrollcalls: Array<IMemberRollCall> } = JSON.parse(response.body)
    const id = res.memberrollcalls[0]._id

    // delete
    await server.inject({ method: 'DELETE', url: `/v1/memberrollcalls/${id}`})

    const response1 = await server.inject({ method: 'GET', url: `/v1/memberrollcalls/${id}`})
    const response2 = await server.inject({ method: 'PUT', url: `/v1/memberrollcalls/${id}`})
    const response3 = await server.inject({ method: 'DELETE', url: `/v1/memberrollcalls/${id}`})
    const response4 = await server.inject({ method: 'GET', url: `/v1/classes/${id}/date/20211201/courses/${id}/groups/${id}/memberrollcalls`})
    expect(response1.statusCode).toBe(404)
    expect(response2.statusCode).toBe(404)
    expect(response3.statusCode).toBe(404)
    expect(response4.statusCode).toBe(404)
  })
})