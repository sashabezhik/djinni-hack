const cron = require('node-cron')
const { mailingInfoService } = require('../mailing/mailingInfo.service')

class CronService {
    _tasks

    constructor() {
        this._tasks = []
    }  

    async addTask(timeString, { name, message, userId, filterUrl }, callback) {
        await mailingInfoService.createMailing({
            name,
            message,
            userId,
            url: filterUrl
        })

        const task = cron.schedule(timeString, callback)
        this._tasks.push({ filterUrl, task })
    }

    async updateTask(timeString, { 
        name, 
        filterUrl, 
        oldFilterUrl, 
        message, 
        status 
    }, callback) {
        await mailingInfoService.updateMailing({ 
            name, 
            filterUrl, 
            oldFilterUrl, 
            message 
        })

        this.deleteTask(oldFilterUrl)

        const updatedTask = cron.schedule(timeString, callback)
        if (status === 'paused') updatedTask.stop()
   
        this._tasks.push({ filterUrl, task: updatedTask })
    }

    restoreTask(timeString, { filterUrl, status }, callback) {
        const task = cron.schedule(timeString, callback)
        if (status === 'paused') task.stop()

        this._tasks.push({ filterUrl, task })
    }

    startTask(filterUrl) {        
        const { task } = this.findTaskByUrl(filterUrl)
        task.start()
    }

    pauseTask(filterUrl) {
        const { task } = this.findTaskByUrl(filterUrl)
        task.stop()
    }

    deleteTask(filterUrl) {
        const { task } = this.findTaskByUrl(filterUrl)
        task.stop()

        this.removeTaskByUrl(filterUrl)
    }

    findTaskByUrl(url) {
        return this._tasks.find(task => task.filterUrl === url)
    }

    removeTaskByUrl(url) {
        this._tasks = this._tasks.filter(task => task.filterUrl !== url)
    }
}

module.exports = {
    CronService
}