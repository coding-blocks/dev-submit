/**
 * Created by abhishekyadav on 23/08/17.
 */
const server=require('./server'),
    app=server.app,
    db=server.db;


db.sync({force: true}).then(() => {
    console.log('Database configured')

    app.listen(4000, function (req, res, next) {
        console.log('Server Listening at 4000');
    });
});