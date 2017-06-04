import FeedParser from 'feedparser'
import cheerio from 'cheerio'
import got from 'got'
import urlUtil from 'url'
import iconv from 'iconv-lite'
import Stream from 'stream'
import _ from 'lodash'

export default class {
  constructutor (url) {
    this.url = url
  }

  streamFeed (body) {
    let articles = []
    let meta = {}
    let s = new Stream()
    s.readable = true
    s.pipe(new FeedParser()).on('meta', (m) => {
      meta.title = m.title
      meta.description = m.description
      meta.favicon = m.favicon
      meta.link = m.link
      meta.url = m.xmlUrl ? m.xmlUrl : this.url
    }).on('readable', () => {
      let stream = this
      let item = stream.read()
      while (item) {
        articles.push(item)
        item = stream.read()
      }
    })

    s.emit('data', body)
    s.emit('end')

    return {
      meta: meta,
      articles: articles
    }
  }

  findFeedUrlInHtml (body, url) {
    const dom = cheerio.load(body)
    let href = dom('link[type="application/rss+xml"]').attr('href')
    if (!href) {
      href = dom('link[type="application/atom+xml"]').attr('href')
    } else {
      if (!href.match(/^http/)) {
        href = urlUtil.resolve(url, href)
      }
      return href
    }
    return null
  }

  normalizeEncoding (buffer) {
    let body = buffer.toString()
    let encoding

    let xmlDeclaration = body.match(/^<\?xml .*\?>/)
    if (xmlDeclaration) {
      const encodingDeclaration = xmlDeclaration[0].match(/encoding=("|').*?("|')/)
      if (encodingDeclaration) {
        encoding = encodingDeclaration[0].substring(10, encodingDeclaration[0].length - 1)
      }
    }

    if (encoding && encoding.toLowerCase() !== 'utf-8') {
      body = iconv.decode(buffer, encoding)
    }
  }

  processFeed (body) {
    return new Promise((resolve, reject) => {
      resolve(this.streamFeed(this.normalizeEncoding(body)))
    })
  }

  processUrl (url) {
    const self = this
    const promise = new Promise((resolve, reject) => {
      got(url)
      .then(res => {
        self.processFeed(res.body).then(data => {
          resolve(data)
        }, err => {
          if (err) {}
          const link = self.findFeedUrlInHtml(res.body, self.url)
          if (link !== null) {
            self.processUrl(link)
          } else {
            resolve(null)
          }
        })
      }, err => {
        if (err) {}
      })
    })
    return promise
  }

  init () {
    const promise = new Promise((resolve, reject) => {
      resolve(this.processUrl(this.url))
    })
    return promise
  }
}
