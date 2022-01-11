const httpUtil = require('./httpUtil')
const { bearer, dir } = require('./config')
const fs = require('fs')
const path = require('path')
const section = require('./section')
const { withSpinner } = require('./oraUtil')
module.exports = async ({ course_id, course_name }) => {
  const chapterUrl = `https://weblearn.kaikeba.com/student/courseinfo?course_id=${course_id}`
  const chapterRet = await httpUtil.get( {
    url: chapterUrl,
    json: true,
    headers: {
      'Authorization': bearer,
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    }
  })
  console.log('JOE_ChapterList: ' + chapterRet.data.chapter_list.length)

  const data = chapterRet.data.chapter_list.slice(0, chapterRet.data.chapter_list.length)
  for (let i = 0; i < data.length; i++) {
    const chapter = data[i]
    console.log('JOE_chapter: ' + chapter)
    const dirpath = path.join(dir, course_name, chapter.chapter_name)
    if (!fs.existsSync(dirpath)) {
      fs.mkdirSync(dirpath)
    }
    // global.spinnies.add(' ' + chapter.chapter_name)
    // await section({
    //   course_id,
    //   course_name,
    //   chapter_id: chapter.chapter_id,
    //   chapter_name: chapter.chapter_name,
    // })
    // global.spinnies.succeed(' ' + chapter.chapter_name)
    await withSpinner({
      text: chapter.chapter_name,
      prefixText: ' ',
      spinner: 'line',
    })(async () => {
      await section({
        course_id,
        course_name,
        chapter_id: chapter.chapter_id,
        chapter_name: chapter.chapter_name,
      })
    })
  }
}
