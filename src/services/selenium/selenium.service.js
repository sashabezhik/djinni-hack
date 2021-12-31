require('chromedriver')
const { Builder, By, until } = require('selenium-webdriver')

class SeleniumService {
    async init() {
        this._driver = await new Builder()
            .forBrowser('chrome')
            .build()

        this._actions = this._driver.actions({ async: true })
    }

    async openPageByUrl(url) {
        await this._driver.get(url)
    }

    async findElementBy(type, selector) {
        switch (type) {
            case 'css':
                return await this._driver.findElement(By.css(selector))
            default:
                return null
        }
    }

    async findElementsBy(type, selector) {
        switch (type) {
            case 'css':
                return await this._driver.findElements(By.css(selector))
            default:
                return []
        }
    }

    async sendKeysToElement(element, text) {
        await element.sendKeys(text)
    }

    async clearElementContent(element) {
        await element.clear()
    }

    async clickElement(element, type) {
        switch (type) {
            case 'doubleClick':
                return await this._actions.doubleClick(element).perform()
            case 'click':
                return await this._actions.click(element).perform()
            default:
                return null
        }
    }

    async executeScript(script) {
        await this._driver.executeScript(script)
    }

    async getElementAttribute(element, attribute) {
        return await element.getAttribute(attribute)
    }

    async getCurrentUrl() {
        return await this._driver.getCurrentUrl()
    }

    async sleep(ms) {
        await this._driver.sleep(ms)
    }

    async quit() {
        await this._driver.quit()
    }
}

module.exports = {
    SeleniumService
}