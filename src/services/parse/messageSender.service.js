const { usedHrefService } = require('../usedHref/usedHref.service')

class MessageSenderService {
    _selenium

    constructor(selenium) {
        this._selenium = selenium
    }

    async sendMessageToCandidates(candidateHrefs, message) {
        try {
            for (const href of candidateHrefs) {
                await this._selenium.openPageByUrl(href)

                // const messageTextArea = await this._selenium.findElementBy('css', '#body')
                // await this._selenium.clearElementContent(messageTextArea)
                // await this._selenium.sendKeysToElement(messageTextArea, message)
                // await this._selenium.sleep(2000)

                // try {
                //     await this._selenium.findElementBy('css', '#answer')
                // } catch (err) {
                //     await this._selenium.executeScript("document.getElementById('send-btn').click()") 
                //     await this._selenium.sleep(3000)
                //     await usedHrefService.create({ url: href })
                // }
            }
        } catch (err) {
            throw new Error(`Send message error: ${err.message}`)
        }
    }
}

module.exports = {
    MessageSenderService
}