const fs = require('fs')
const path = require('path')
const httpUtil = require('./httpUtil')
const chapter = require('./chapter')
const ora = require('./oraUtil')
const Spinnies = require('spinnies')
const { bearer, dir } = require('./config')
const { withSpinner } = require('./oraUtil')
//global.spinnies = new Spinnies()
;(async () => {
  const courseRet = await httpUtil.get( {
      url: 'https://weblearn.kaikeba.com/student/opt/course/list?type=0&option=2',
      json: true,
      headers: {
          'Authorization': bearer,
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
      }
    }
  )
  console.log('JOE_CourseList: ' + courseRet.data.toJSON)

  /*
  // 过滤过期、公开课
  const data = courseRet.data
    .filter(c => c.type === '1' && c.expired_status === 1)
    .slice(0, 2)

  for (let i = 0; i < data.length; i++) {
    const course = data[i]
    const dirpath = path.join(dir, course.course_name)
    if (fs.existsSync(dirpath)) {
      break
    } else {
      fs.mkdirSync(dirpath)
    }
    // global.spinnies.add(course.course_name)
    // await chapter({
    //   course_id: course.course_id,
    //   course_name: course.course_name,
    // })
    // global.spinnies.succeed(course.course_name)
    await withSpinner({ text: course.course_name, spinner: 'line' })(
      async () => {
        await chapter({
          course_id: course.course_id,
          course_name: course.course_name,
        })
      }
    )
  }
  */

    const course_id = '237312'
    const course_name = '百万架构师培养计划'

    const dirpath = path.join(dir, course_name)
    if (!fs.existsSync(dirpath)) {
        fs.mkdirSync(dirpath)
    }
    await withSpinner({ text: course_name, spinner: 'line' })(
        async () => {
            await chapter({
                course_id: course_id,
                course_name: course_name,
            })
        }
    )

})()
