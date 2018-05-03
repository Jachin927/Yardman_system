'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"//http://lostars.cn/answer.php"',
  API_ROOT2: '"//http://lostars.cn/students.php"',
})
