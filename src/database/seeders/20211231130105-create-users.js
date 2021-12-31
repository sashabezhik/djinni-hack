require('dotenv').config()
const { cryptoService } = require('../../services/crypto/crypto.service')
 
cryptoService.init()

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await  queryInterface.bulkInsert('users', [
        {
          email: 'vladislav@skillcombo.com',
          password: cryptoService.encrypt('ucanfly1488')
        }
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {})
  }
}
