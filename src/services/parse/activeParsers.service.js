const { CronService } = require('../cron/cron.service')
const { ParseCandidatesFacade } = require('./parseCandidatesFacade.service')
const { mailingInfoService } = require('../mailing/mailingInfo.service')
const { cryptoService } = require('../crypto/crypto.service')

class ActiveParsersService {
    _cronService
    _parseFunc
    _activeParsers
    _statusHandlers

    constructor() {
        this._cronService = new CronService()
        this._activeParsers = []

        this._parseFunc = async ({ email, password, loginUrl, filterUrl, message }) => {
            try {
                const parseCandidateFacade = new ParseCandidatesFacade()
                this._activeParsers.push({ filterUrl, parser: parseCandidateFacade })

                await parseCandidateFacade.init()
                await parseCandidateFacade.parseCandidatesAndSendLetters({
                    loginInfo: { email, password, loginUrl },
                    filterUrl,
                    message
                })

                this.removeParserByUrl(filterUrl)
            } catch (err) {
                this.removeParserByUrl(filterUrl)
            }
        }

        this._statusHandlers = {
            'start': async (filterUrl) => {
                await mailingInfoService.findMailingAndUpdateStatus(filterUrl, 'active')
                this._cronService.startTask(filterUrl)
            },
            'pause': async (filterUrl) => {
                await mailingInfoService.findMailingAndUpdateStatus(filterUrl, 'paused')
                this._cronService.pauseTask(filterUrl)

                const activeParser = this.findParserByUrl(filterUrl)
                if (activeParser) await activeParser.parser._selenium.quit()
            },
            'delete': async (filterUrl) => {
                await mailingInfoService.deleteMailing(filterUrl)
                this._cronService.deleteTask(filterUrl)

                const activeParser = this.findParserByUrl(filterUrl)
                if (activeParser) await activeParser.parser._selenium.quit()
            }
        }
    }

    async createParser(cronString, parserInfo) {
        try {
            const { name, message, userId, filterUrl } = parserInfo

            await this._cronService.addTask(
                cronString, 
                { name, message, userId, filterUrl }, 
                () => this._parseFunc(parserInfo)
            )
        } catch (err) {
            console.log(err.message)
        }
    }

    async updateParser(cronString, parserInfo) {
        try {
            const { name, filterUrl, oldFilterUrl, message, status } = parserInfo

            await this._cronService.updateTask(
                cronString, 
                { name, filterUrl, oldFilterUrl, message, status },
                () => this._parseFunc(parserInfo)
            )
        } catch (err) {
            console.log(err.message)
        }
    }

    async updateParserStatus({ filterUrl, status }) {
        try {
            const handler = this._statusHandlers[status]
            await handler(filterUrl)
        } catch (err) {
            console.log(err.message)
        }
    }

    async restoreParsersFromDb(cronString, loginUrl) {
        try {
            const mailings = await mailingInfoService.findAllMailings()

            for (const mailing of mailings) {
                const { email, password: hashedPassword } = await mailingInfoService.getMailingUser(mailing)
                const password = cryptoService.decrypt(hashedPassword).toString()

                const { url: filterUrl, message, status } = mailing

                this._cronService.restoreTask(
                    cronString,
                    { filterUrl, status},
                    () => this._parseFunc({ email, password, loginUrl, filterUrl, message })
                )
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    findParserByUrl(url) {
        return this._activeParsers.find(parser => parser.filterUrl === url)
    }

    removeParserByUrl(url) {
        this._activeParsers = this._activeParsers.filter(parser => parser.filterUrl !== url)
    }
}

module.exports = {
    ActiveParsersService
}