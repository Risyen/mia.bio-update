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
    gitClone(
      'https://github.com/Risyen/Mia.bio',
      target,
      { shallow: true },
      (err) => {
        if (err) return reject(new Error(`About. ${err}`))
        spinner.succeed(true)
        spinner.start('Template downloaded. Diff and upgrading...')
        resolve()
      }
    )
  })
}

const hash = (buf) => createHash('sha1').update(buf).digest('hex')

const ignores = ['node_modules', '.git']

const collect = (currentPath) => {
  const files = fs.readdirSync(currentPath)
  const outputs = []

  for (const name of files) {
    const filePath = path.join(currentPath, name)
    if (ignores.includes(name)) continue
    const stat = fs.statSync(filePath)

    if (!stat.isDirectory()) {
      const data = fs.readFileSync(filePath)
      outputs.push({
        name,
        size: stat.size,
        hash: hash(data),
        source: filePath,
      })
    } else {
      collect(filePath)
      // outputs.push(...)
    }
  }
  return outputs
}

const upgradeFiles = async (tempDir, userDir) => {
  const files = collect(tempDir)
  await Promise.all(
    files.map(async (item) => {
      if (item.name.endsWith('md') || item.name.endsWith('mdx')) return
      //  remove md mdx
      const reletivePath = item.name
      const userFilePath = path.join(userDir, reletivePath)
      // console.log(userFilePath)
      await fs.ensureFile(userFilePath)
      await fs.copyFile(item.source, userFilePath)
    })
  )

  const pkgJson = await fs.readJSON(path.join(tempDir, 'package.json'))
  const userPkgJson = await fs.readJSON(path.join(userDir, 'package.json'))
  const lastVersionPkg = {
    ...userPkgJson,
    dependencies: pkgJson.dependencies,
    devDependencies: pkgJson.devDependencies,
    scripts: pkgJson.scripts,
  }
  console.log(lastVersionPkg)
  await fs.writeJSON(path.join(userDir, 'package.json'), lastVersionPkg, {
    spaces: 2,
  })
  spinner.succeed()
}

module.exports = {
  getTmpBlog,
  getUserDir,
  donwLastVersionTemplate,
  upgradeFiles,
}
