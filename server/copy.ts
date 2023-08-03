import 'zx/globals'

const run = async () => {
  await fs.copyFile(
    path.join(__dirname, '../render/common/dist/index.html'),
    path.join(__dirname, './index.html')
  )
  await fs.copyFile(
    path.join(__dirname, '../mahiro/bangumi.json'),
    path.join(__dirname, './bangumi.json')
  )
  await fs.copyFile(
    path.join(__dirname, '../mahiro/data.ts'),
    path.join(__dirname, './data.ts')
  )
  await fs.copyFile(
    path.join(__dirname, '../mahiro/sync.ts'),
    path.join(__dirname, './sync.ts')
  )
}

run()
