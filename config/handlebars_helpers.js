module.exports = {
  ifCond: function (a, b, options) {
    if (a == b) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  ifPay: function (a, b, c, options) {
    if (a == b || a == c) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  multiply: function(a,b){
    return +a * +b
  },
  inc: function(value,options){
    return parseInt(value)+1
  },
  formatDate: function(value, options){
    return value.toISOString().split('T')[0]
  }
}