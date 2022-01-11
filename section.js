const httpUtil = require('./httpUtil')
const { bearer, dir } = require('./config')
const fs = require('fs')
const path = require('path')
const download = require('./download')
const video = require('./video')
const { withSpinner } = require('./oraUtil')
module.exports = async ({
  course_id,
  course_name,
  chapter_id,
  chapter_name,
}) => {
  const sectionUrl = `https://weblearn.kaikeba.com/student/chapterinfo?course_id=${course_id}&chapter_id=${chapter_id}`
  const sectionRet = await httpUtil.get( {
    url: sectionUrl,
    json: true,
    headers: {
      'Authorization': bearer,
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
    }
  })

  console.log('JOE_SectionList: ' + sectionRet.data.section_list.length)
  const data = sectionRet.data.section_list.slice(0, sectionRet.data.section_list.length)
  for (let i = 0; i < data.length; i++) {
    const { group_list } = data[i]
    console.log('JOE_group_list: ' + group_list.length)
    if (!group_list || group_list.length < 1) {
      break
    }
    const group = group_list[0]
    const sectionPath = path.join(
      dir,
      course_name,
      chapter_name,
      group.group_name
    )
    if (!fs.existsSync(sectionPath)) {
      fs.mkdirSync(sectionPath)
    }
    // global.spinnies.add('   ' + group.group_name)
    // await downloadResource(group, sectionPath)
    // global.spinnies.succeed('   ' + group.group_name)
    await withSpinner({
      text: group.group_name,
      prefixText: '   ',
      spinner: 'line',
    })(async () => {
      await downloadResource(group, sectionPath)
    })
  }
}

async function downloadResource(group, sectionPath) {
  for (let j = 0; j < group.content_list.length; j++) {
    const { content_id, content_type, content_title, content } =
      group.content_list[j]
    const tsDir = path.join(sectionPath, content_title + 'tsfile')
    switch (content_type) {
      case 3:
        //case 7:
        //3:点播,7:直播
        await video({ content_id, content_title, dir: tsDir })
        break
      case 4:
        //作业
        break
      case 6:
        //资料
        for (let z = 0; z < content.length; z++) {
          const { url, name } = content[z]
          await download(url, path.join(sectionPath, name))
        }
        break
      default:
        console.warn('content_type未枚举', content_type, content_title, content)
        break
    }
  }
}
