const os = require('os')
const path = require('path')
const fs = require('fs-extra')
const { createHash } = require('crypto')
const gitClone = require('git-clone')

const spinner = require('./spinner')

const getTmpBlog = async () => {
  const dir = path.join(os.tmpdir(), 'miabio')
  await fs.remove(dir)
  await fs.emptyDirSync(dir)
  return dir
}

const getUserDir = async () => {
  const dir = process.cwd()
  const config = await fs.pathExists(path.join(dir, 'blog.config.js'))
  if (!config) {
    throw new Error('Warn. The current dir is not "mia.bio"blog.\n')
    process.exit(1)
  }
  return dir
}

const donwLastVersionTemplate = async (target) => {
  spinner.start('Installing the latest version....waiting ')
  return new Promise((reslove, reject) => {
    gitClone()
  })
}

;(async () => {
  const res = await getTmpBlog()
  console.log(res)
  // await getUserDir()
  await donwLastVersionTemplate()
})()
