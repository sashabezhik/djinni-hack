const { usedHrefService } = require('../usedHref/usedHref.service')

class CandidateParserService {
    _selenium
    _page
    _nextPageUrl
    _candidateHrefs

    constructor(selenium) {
        this._selenium = selenium
        this._candidateHrefs = []
    }

    async parseCandidateHrefsByUrl(url) {
        try {
            this._page = 1
            this._nextPageUrl = this.addPagePostfixToUrl(url, this._page)

            let lastPage = false

            while (!lastPage) {
                await this._selenium.openPageByUrl(this._nextPageUrl)

                const anchors = await this._selenium.findElementsBy('css', 'a.profile')
                const parsedHrefs = await Promise.all(
                    anchors.map(async (anchor) => await this._selenium.getElementAttribute(anchor, 'href'))
                )

                this._candidateHrefs.push(...parsedHrefs)

                this._page++
                this._nextPageUrl = this.addPagePostfixToUrl(url, this._page)

                const nextPageBtn = await this._selenium.findElementBy('css', '.next')
                const childCount = await this._selenium.getElementAttribute(nextPageBtn, 'childElementCount')

                if (!parseInt(childCount)) lastPage = true
            }

            await this.filterUnusedHrefs()
            
            return this._candidateHrefs
        } catch (err) {
            throw new Error(`Parse hrefs error: ${err.message}`)
        }
    }

    async filterUnusedHrefs() {
        const unusedHrefs = []

        for (const href of this._candidateHrefs) {
            const hrefExists = await usedHrefService.findOne({ where: {
                url: href
            }})

            if (!hrefExists) unusedHrefs.push(href)
        }

        this._candidateHrefs = [...unusedHrefs]
    }

    async addPagePostfixToUrl(url, page) {
        return url.concat(`&page=${page}`)
    }
}

module.exports = {
    CandidateParserService
}