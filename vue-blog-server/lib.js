const fs = require('fs')
const path = require('path')
const matter = require("gray-matter")
const marked = require('marked')


function readFileAll(dirPath) {

  const result = new Map()
  const files = fs.readdirSync(dirPath)

  files.forEach(fileName => {
    const fileDir = path.join(dirPath, fileName)
    const stats = fs.statSync(fileDir)

    if (stats.isFile()) {
      const i = fileName.lastIndexOf('.md')
      result.set(fileName.slice(0, i), fileDir)
    }
    else if (stats.isDirectory()) {
      readFileAll(fileDir)
    }
  })

  return result
}

const readArticle = path => fs.readFileSync(path, 'utf-8')

const readArticlesData = articleNameMap => {

  const articles = new Map()
  const arr = []

  // 格式化数据 
  for (let key of articleNameMap.keys()) {
    const fileContent = readArticle(articleNameMap.get(key))
    const mdMatter = matter(fileContent)

    // markdown 转 html
    mdMatter.content = marked(mdMatter.content)
    mdMatter.data.wordCount = wordCount(mdMatter.content)

    arr.push({
      name: key,
      value: mdMatter
    })

  }

  // 排序日期
  arr.sort((v1, v2) => v2.value.data.date.getTime() - v1.value.data.date.getTime())
  arr.forEach(v => articles.set(v.name, v.value))

  return articles
}

const countInfo = articlesData => {

  let info = {
    tags: {},
    categories: {},
    articles: []
  }

  for (let value of articlesData.values()) {

    // tags
    value.data.tags.forEach(v => {

      if (info.tags[v])
        info.tags[v] ++
      else
        info.tags[v] = 1

    })
    
    // category
    const cateKey = value.data.category

    if (info.categories[cateKey])
      info.categories[cateKey] ++
    else
      info.categories[cateKey] = 1


    info.articles.push(value.data.title)

  }

  return info
}

function wordCount(data) {
  const pattern = /[a-zA-Z0-9_\u0392-\u03c9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g
  
  const m = data.match(pattern)
  let count = 0
  
  if(m == null) return count
  
	for(var i = 0; i < m.length; i++) {

		if(m[i].charCodeAt(0) >= 0x4E00)
			count += m[i].length
		else
      count += 1
      
  }
  
  return count
}

module.exports = {
  readFileAll,
  readArticle,
  readArticlesData,
  countInfo
}
