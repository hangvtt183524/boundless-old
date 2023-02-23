const { transform, isObject, difference, keys } = require('lodash')
const fs = require('fs')
const path = require('path')
const colog = require('colog')

const en = require('../locales/en.json')

const directoryPath = path.join(__dirname, '../locales')
const getFiles = (directoryPath, callback) => {
  fs.readdir(directoryPath, (err, files) => {
    if (err) callback(err, null)
    callback(null, files)
  })
}
getFiles(directoryPath, (err, files) => {
  if (err) console.log(err)
  const filteredFiles = files.filter(ele => (ele.indexOf('.json') >= 0 && ele !== 'en.json'))
  filteredFiles.forEach(file => {
    if (file !== 'en.json') {
      if (file.indexOf('.json') >= 0) {
        const curLocale = require(`../locales/${file}`)
        colog.progress(filteredFiles.indexOf(file) + 1, filteredFiles.length)
        console.log('\n')
        verifyKeys(en, curLocale, file)
      }
    } else {
      colog.progress(files.indexOf(file) + 1, files.length)
      console.log('\tskipping EN.JSON...')
    }
  })
})

const verifyKeys = (object, base, fileName) => {
  const translatedFile = fileName.replace('.json', '.translated.json')
  const changes = (base, object) => {
    return transform(base, function (result, value, key) {
      const diff = difference(keys(value), keys(object[key]))
      if (diff.length > 0) {
        result[key] = diff
      }
      if (isObject(value) && isObject(object[key])) {
        changes(value, object[key])
      }
    })
  }
  const getValues = missing => {
    const result = {}
    Object.keys(missing).map(key => {
      const missingValues = (missingVal, keyVal) => {
        Object.keys(missingVal[keyVal]).map(misKey => {
          const curKey = keyVal + '.' + missing[keyVal][misKey]
          const curVal = en[keyVal][missing[keyVal][misKey]]
          result[curKey] = curVal
          console.log(colog.magenta(curKey), ': ', colog.white(curVal))
        })
      }
      missingValues(missing, key)
    })
    fs.writeFile(path.join(__dirname, `../locales/missing/${translatedFile}`), JSON.stringify(result, null, 4), err => {
      if (err) throw err
    })
  }
  console.log(colog.cyan(`Missing Locales from ${fileName}\n`))
  getValues(changes(object, base))
  console.log('\n')
}
