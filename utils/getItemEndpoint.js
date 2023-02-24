export default (params, query) => {
  // see '~/pages/b/_.vue' getItemEndpoint() function not centralized
  let result = 'item'
  let queryParams = ''
  if (params.pathMatch) {
    const pathMatchSplit = params.pathMatch.split('/')
    const categoryId = pathMatchSplit[pathMatchSplit.length - 1]
    queryParams += `categoryId=${categoryId}&`
  }
  if (query.id) queryParams += `brandId=${query.id}&`
  if (query.search) queryParams += `search=${query.search}&`
  if (params.filter) queryParams += `filter=${params.filter}&`
  if (query.pageCurrent >= 1) queryParams += `pageNum=${query.pageCurrent + 1}&`
  if (queryParams !== '') result += '?' + queryParams.slice(0, -1)
  return result
}
