import DB from '../db'
const db = new DB()
const connect = db.init()
const article = connect.article
const tag = connect.tag
const feed = connect.feed

export default {
  getState () {
    article.getState()
    tag.getState()
    feed.getState()
  }
}
