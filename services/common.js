
class  CommonService{
  static PAGE_LIMIT=6
  //藉由資料數量回傳頁數，總頁數，分頁相關訊息
  static async calculatePagination(data,count,page){
    try{
      data['page'] = Number(page) || 1
      data['pages'] = Math.ceil(count / this.PAGE_LIMIT)
      data['totalPage'] = Array.from({ length: data['pages'] }).map((item, index) => index + 1)
      data['prev'] = data['page'] - 1 < 1 ? 1 : data['page'] - 1
      data['next'] = data['page'] + 1 > data['pages'] ? data['pages'] : data['page'] + 1

      return data
    }catch(err){
      console.error(err)
      throw new Error(err)
    }
  }

}

module.exports = CommonService