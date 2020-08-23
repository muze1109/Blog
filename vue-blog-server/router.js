const Router = require('koa-router')
const lib = require('./lib.js')
const router = new Router()

// 文件名跟文件所在路径的一个映射
let g_articlesNameMap = lib.readFileAll("./article")

// 文章所有数据
let g_allArticleOfData = lib.readArticlesData(g_articlesNameMap)

// 文章的信息，即 文章的分类，tag，文章数总数
let g_blogInfo = lib.countInfo(g_allArticleOfData)

// 文章的路径 type Array
let g_articlesContentArray = Array.from(g_allArticleOfData.values())

router.get('/', async ctx => {

  const data = []

  for (let value of g_allArticleOfData.values())
    data.push(value.data)

  ctx.body = data

})

router.get('/article', async ctx => {

  const fileName = ctx.query['title']

  ctx.body = g_allArticleOfData.get(fileName)

})

router.get('/info', async ctx => ctx.body = g_blogInfo)

router.get('/archive', async ctx => ctx.body = [...g_articlesNameMap.keys()])

router.get('/category', async ctx => {
  ctx.body = g_articlesContentArray
    .filter(v => v.data.category === ctx.query.category)
    .map(v => v.data)
})

router.get('/tag', async ctx => {
  ctx.body = g_articlesContentArray
    .filter(v => v.data.tags.indexOf(ctx.query.tag) != -1)
    .map(v => v.data)
})

router.get('/article/all', async ctx => {
  ctx.body = [...(g_articlesNameMap.keys())]
})


/**
 * @desc http://localhost:3000/articles?start=0&limit=5
 */
router.get('/articles', async ctx => {
  
  let arr = [],
    start = ctx.query.start * 1 || 0,
    limit = ctx.query.limit * 1 || 5,
    end   = start + limit
	
	
	if (limit === -1) {
		start = 0
		end = g_articlesContentArray.length
	}

  if (_isStartErr(start)) {
    ctx.body = {
      start,
      limit,
      total: g_articlesContentArray.length,
      error: "下标值大于文章数"}
    return
  }
  else if (_isOverflow(end))
    end = g_articlesContentArray.length


  for (let i = start; i < end; ++i)
    arr.push(g_articlesContentArray[i])

  ctx.body = {
    start,
    limit,
    total: g_articlesContentArray.length,
    count: arr.length,
    articles: arr
  }

})

const _isStartErr = start => start > g_articlesContentArray.length

const _isOverflow = end => end > g_articlesContentArray.length

module.exports = router
