module.exports = {
  apps : [{
    name:'shopping_cart',
    script: './app.js',
    instances: 1,
    watch: false,
    max_memory_restart:'500M',
    env:{
      NODE_ENV:'development',
      ID:'10'
    },
    env_development:{
      NODE_ENV:'development',
      ID:'11'
    }
  }],
};
