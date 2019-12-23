if (process.env.NODE_ENV === 'production') {
  module.exports = {mongoDbUrl: 'databaseVeSifresiBurayaGelecek'}
} else {
  module.exports = {mongoDbUrl: 'mongodb://localhost:27017/insurance-playbook'}
}