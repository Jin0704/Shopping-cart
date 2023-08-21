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
  }
}