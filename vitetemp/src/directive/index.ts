// 注册全局自定义指令
function init (app: any) {
    const modules = import.meta.globEager('./modules/*.ts')
    for (let key in modules) {
        let name = modules[key]['default']['name']
        let fn = modules[key]['default']['fn']
        app.directive(name, fn)
    }
}
export default init