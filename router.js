const authController = require('./controllers/auth');
const resourcesController = require('./controllers/fake-resources');

module.exports.set = (app) => {
    app.post('/signup', authController.signup);
    app.post('/login', authController.login);
    app.post('/token', authController.token);
    app.get('/resources', authController.verify, resourcesController.getResources);
}