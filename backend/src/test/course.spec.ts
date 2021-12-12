import { FastifyInstance } from 'fastify'
import { startFastify } from '../server'
import { Server, IncomingMessage, ServerResponse } from 'http'
import * as dbHandler from './db'
import { ICourse } from '../types/course'

describe('Course API test', () => {
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
      url: '/v1/courses',
      payload: {
        className: '21.11',
        date: '20211201',
        courseName: 'User Story',
        lecturer: 'Richard',
        startTime: '09:00',
        endTime: '11:00',
        groups: [{
          _id: 'group id',
          groupName: 'WPTSD',
          groupStatus: 'grey',
          createdAt: 'created time',
          members: [{
            eID: '126172',
            memberName: '陳正豪',
            status: 'grey',
            reason: ''
          }]
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

  it('should successfully GET a list of course and GET one course', async () => {
    const response1 = await server.inject({ method: 'GET', url: '/v1/courses' })
    expect(response1.statusCode).toBe(200)

    const res1: { courses: Array<ICourse> } = JSON.parse(response1.body) 
    expect(res1.courses[0].className).toBe('21.11')
    expect(res1.courses[0].date).toBe('20211201')
    expect(res1.courses[0].courseName).toBe('User Story')
    expect(res1.courses[0].lecturer).toBe('Richard')
    expect(res1.courses[0].startTime).toBe('09:00')
    expect(res1.courses[0].endTime).toBe('11:00')
    expect(res1.courses[0].groups[0].groupName).toBe('WPTSD')
    expect(res1.courses[0].groups[0].groupStatus).toBe('grey')
    expect(res1.courses[0].groups[0].members[0].eID).toBe('126172')
    expect(res1.courses[0].groups[0].members[0].memberName).toBe('陳正豪')
    expect(res1.courses[0].groups[0].members[0].status).toBe('grey')
    expect(res1.courses[0].groups[0].members[0].reason).toBe('')

    const id = res1.courses[0]._id
    const response2 = await server.inject({ method: 'GET', url: `/v1/courses/${id}` })
    expect(response2.statusCode).toBe(200)

    const res2: { course: ICourse } = JSON.parse(response2.body) 
    expect(res2.course.className).toBe('21.11')
    expect(res2.course.date).toBe('20211201')
    expect(res2.course.courseName).toBe('User Story')
    expect(res2.course.lecturer).toBe('Richard')
    expect(res2.course.startTime).toBe('09:00')
    expect(res2.course.endTime).toBe('11:00')
    expect(res2.course.groups[0].groupName).toBe('WPTSD')
    expect(res2.course.groups[0].groupStatus).toBe('grey')
    expect(res2.course.groups[0].members[0].eID).toBe('126172')
    expect(res2.course.groups[0].members[0].memberName).toBe('陳正豪')
    expect(res2.course.groups[0].members[0].status).toBe('grey')
    expect(res2.course.groups[0].members[0].reason).toBe('')

    // GET courses by parameters
    const classResponse = await server.inject({ 
      method: 'POST',
      url: '/v1/classes',
      payload: {
        className: '21.11'
      }
    })

    await server.inject({ 
      method: 'POST',
      url: '/v1/grouprollcalls',
      payload: {
        className: '21.11',
        date: '20211201' ,
        courseName: 'User Story',
        groupName: 'WPTSD',
        groupStatus: 'grey',
        members: []
      }
    })

    const class_id = JSON.parse(classResponse.body)._class._id
    const response3 = await server.inject({ method: 'GET', url: `/v1/classes/${class_id}/courses` })
    expect(response3.statusCode).toBe(200)

    const res3: { courses: Array<ICourse> } = JSON.parse(response3.body) 
    expect(res3.courses[0].className).toBe('21.11')
    expect(res3.courses[0].date).toBe('20211201')
    expect(res3.courses[0].courseName).toBe('User Story')
    expect(res3.courses[0].lecturer).toBe('Richard')
    expect(res3.courses[0].startTime).toBe('09:00')
    expect(res3.courses[0].endTime).toBe('11:00')

    const response4 = await server.inject({ method: 'GET', url: `/v1/classes/${class_id}/date/20211201/courses` })
    expect(response4.statusCode).toBe(200)

    const res4: { courses: Array<ICourse> } = JSON.parse(response4.body) 
    expect(res4.courses[0].className).toBe('21.11')
    expect(res4.courses[0].date).toBe('20211201')
    expect(res4.courses[0].courseName).toBe('User Story')
    expect(res4.courses[0].lecturer).toBe('Richard')
    expect(res4.courses[0].startTime).toBe('09:00')
    expect(res4.courses[0].endTime).toBe('11:00')
  })

  it('should successfully POST a course to mongodb and can be found', async () => {
    const response = await server.inject({
      method: 'POST',
      url: '/v1/courses',
      payload: {
        className: '21.11',
        date: '20211201',
        courseName: 'User Story',
        lecturer: 'Richard',
        startTime: '09:00',
        endTime: '11:00',
        groups: [{
          _id: 'group id',
          groupName: 'Tiger',
          groupStatus: 'green',
          createdAt: 'created time',
          members: [{
            eID: '130001',
            memberName: 'Richard',
            status: 'green',
            reason: ''
          }]
        }]
      }
    })
    expect(response.statusCode).toBe(201)
    
    const res: { course: ICourse } = JSON.parse(response.body)
    expect(res.course.className).toBe('21.11')
    expect(res.course.date).toBe('20211201')
    expect(res.course.courseName).toBe('User Story')
    expect(res.course.lecturer).toBe('Richard')
    expect(res.course.startTime).toBe('09:00')
    expect(res.course.endTime).toBe('11:00')
    expect(res.course.groups[0].groupName).toBe('Tiger')
    expect(res.course.groups[0].groupStatus).toBe('green')
    expect(res.course.groups[0].members[0].eID).toBe('130001')
    expect(res.course.groups[0].members[0].memberName).toBe('Richard')
    expect(res.course.groups[0].members[0].status).toBe('green')
    expect(res.course.groups[0].members[0].reason).toBe('')
  })

  it('should successfully PUT a course', async () => {
    const response1 = await server.inject({ method: 'GET', url: '/v1/courses'})
    const res1: { courses: Array<ICourse> } = JSON.parse(response1.body)
    const id = res1.courses[0]._id
    const response2 = await server.inject({
      method: 'PUT',
      url: `/v1/courses/${id}`,
      payload: {
        groups: [{
          groupName: 'WPTSD',
          groupStatus: 'red',
          members:[{
            eID: '126172',
            memberName: '陳正豪',
            status: 'red',
            reason: '睡過頭'
          }]
        }]
      }
    })
    expect(response2.statusCode).toBe(200)

    const res2: { course: ICourse } = JSON.parse(response2.body)
    expect(res2.course.groups[0].groupStatus).toBe('red')
    expect(res2.course.groups[0].members[0].status).toBe('red')
    expect(res2.course.groups[0].members[0].reason).toBe('睡過頭')
  })

  it('should successfully DELETE a course', async () => {
    const response1 = await server.inject({ method: 'GET', url: '/v1/courses'})
    const res1: { courses: Array<ICourse> } = JSON.parse(response1.body)
    const id = res1.courses[0]._id
    const response2 = await server.inject({ method: 'DELETE', url: `/v1/courses/${id}`})
    expect(response2.statusCode).toBe(204)
  })

  it('should return status code 400 when receiving invalid id', async () => {
    const id = 'invalid_id'
    const response1 = await server.inject({ method: 'GET', url: `/v1/courses/${id}`})
    const response2 = await server.inject({ method: 'PUT', url: `/v1/courses/${id}`})
    const response3 = await server.inject({ method: 'DELETE', url: `/v1/courses/${id}`})
    const response4 = await server.inject({ method: 'GET', url: `/v1/classes/${id}/courses`})
    const response5 = await server.inject({ method: 'GET', url: `/v1/classes/${id}/date/20211201/courses`})
    expect(response1.statusCode).toBe(400)
    expect(response2.statusCode).toBe(400)
    expect(response3.statusCode).toBe(400)
    expect(response4.statusCode).toBe(400)
    expect(response5.statusCode).toBe(400)
  })

  it('should return status code 404 when receiving id that does not exist', async () => {
    const response = await server.inject({ method: 'GET', url: '/v1/courses'})
    const res: { courses: Array<ICourse> } = JSON.parse(response.body)
    const id = res.courses[0]._id

    // delete
    await server.inject({ method: 'DELETE', url: `/v1/courses/${id}`})

    const response1 = await server.inject({ method: 'GET', url: `/v1/courses/${id}`})
    const response2 = await server.inject({ method: 'PUT', url: `/v1/courses/${id}`})
    const response3 = await server.inject({ method: 'DELETE', url: `/v1/courses/${id}`})
    const response4 = await server.inject({ method: 'GET', url: `/v1/classes/${id}/courses`})
    const response5 = await server.inject({ method: 'GET', url: `/v1/classes/${id}/date/20211201/courses`})
    expect(response1.statusCode).toBe(404)
    expect(response2.statusCode).toBe(404)
    expect(response3.statusCode).toBe(404)
    expect(response4.statusCode).toBe(404)
    expect(response5.statusCode).toBe(404)
  })
})