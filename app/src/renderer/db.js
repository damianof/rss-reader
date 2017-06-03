import jetpack from 'fs-jetpack'
import fs from 'fs'
import low from 'lowdb'
import { remote } from 'electron'
import fileSync from 'lowdb/lib/storages/file-async'

export default class {

  /**
   * [constructor description]
   * @return {[type]} [description]
   */
  constructor () {
    this.db = null
    this.useDataDir = jetpack.cwd(remote.app.getPath('userData'))
  }

  /**
   * Create Database or Read Existing one
   * @param  {[type]} dbname [description]
   * @return {[type]}        [description]
   */
  createOrReadDatabase (dbname) {
    const yesArticle = fs.existsSync(this.useDataDir.path(dbname.article))
    const yesTag = fs.existsSync(this.useDataDir.path(dbname.tag))
    const yesFeed = fs.existsSync(this.useDataDir.path(dbname.feed))
    if (yesArticle && yesTag && yesFeed) {
      const articleData = fs.readFileSync(this.useDataDir.path(dbname.article))
      const tagData = fs.readFileSync(this.useDataDir.path(dbname.tag))
      const feedData = fs.readFileSync(this.useDataDir.path(dbname.feed))

      if (!articleData && !tagData && !feedData) {
        return
      }
    } else {
      this.useDataDir.write(dbname.article, '')
      this.useDataDir.write(dbname.tag, '')
      this.useDataDir.write(dbname.feed, '')
    }
    return this.loadDatabase(dbname)
  }

/**
 * Load Database
 * @param  {[type]} dbname [description]
 * @return {[type]}        [description]
 */
  loadDatabase (dbname) {
    let database = {}

    database.article = low(this.useDataDir.path(dbname.article), { storage: fileSync })
    database.tag = low(this.useDataDir.path(dbname.tag), { storage: fileSync })
    database.feed = low(this.useDataDir.path(dbname.feed), { storage: fileSync })

    return database
  }

/**
 * Initialize Database
 * @return {[type]} [description]
 */
  init () {
    if (this.db) {
      return this.db
    }
    this.db = this.createOrReadDatabase({
      'article': 'article.json',
      'tag': 'tags.json',
      'feed': 'feeds.json'
    })
    return this.db
  }
}
