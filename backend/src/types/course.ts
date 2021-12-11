// interface IGroupRollCall {
//     groupID: string
//     groupName: string
//     status: string
//     createdAt: string
// }

interface ICourse {
    className: string
    date: string
    courseName: string
    lecturer: string
    startTime: string
    endTime: string
    // groups: IGroupRollCall
}

export { ICourse }