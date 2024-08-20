const fs = require('fs')
const path = require('path')
function getRootPath(dir) {
    console.log(process.cwd())
    return path.resolve(process.cwd(), dir)
}
const runBuild = async () => {
    console.log('build > 文件开始执行！')
    try {
        const OUTPUT_DIR = 'public'
        const VERSION = 'version.json'
        const versionJson = {
            version: 'V_' + Math.floor(Math.random() * 10000) + Date.now()
        }
        fs.writeFileSync(getRootPath(`./${OUTPUT_DIR}/${VERSION}`), JSON.stringify(versionJson))
        console.log(`version file is build successfully!`)
    } catch (error) {
        console.error('version build error:\n' + error)
        process.exit(1)
    }
    console.log('build > 文件执行结束！')
}

export default (env: any, isBuild: any) => {
  return {
    name: 'version',
    // handleHotUpdate(ctx: any) {
    //     console.log('ctx--', ctx)
    //     runBuild()
    // },
    buildStart(res: any) {
      // console.log('build-start')
      isBuild && runBuild()
    }
  };
};
