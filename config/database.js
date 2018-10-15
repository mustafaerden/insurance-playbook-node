if (process.env.NODE_ENV === 'production') {
  module.exports = {mongoDbUrl: 'mongodb://mustafaerden:Me1054620084@ds131983.mlab.com:31983/insurance-playbook'}
} else {
  module.exports = {mongoDbUrl: 'mongodb://localhost:27017/insurance-playbook'}
}