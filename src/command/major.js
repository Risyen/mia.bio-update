const {
  getTmpBlog,
  getUserDir,
  donwLastVersionTemplate,
  upgradeFiles,
} = require('../utils/tools')

const printf = require('../utils/printf')

const entrance = (async () => {
  printf.welcome()
  const tempDir = await getTmpBlog()
  const userDir = await getUserDir()
  await donwLastVersionTemplate(tempDir)
  await upgradeFiles(tempDir, userDir)
  console.log(printf.cyanColor('>Upgrade completed.'))
  process.exit(0)
})()

module.exports = entrance
