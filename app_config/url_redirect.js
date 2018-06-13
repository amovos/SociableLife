module.exports = function urlRedirects(app){
    
    //URL redirect to custom domain
    app.use((req, res, next) => {
        if(req.protocol + '://' + req.hostname !== process.env.APP_DOMAIN){
            res.set('location', process.env.APP_DOMAIN + req.path);
            res.status(301).send();
        } else {
            next();
        }
    });
    
    // Force https redirect
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect('https://' + req.hostname + req.url);
        } else {
            next();
        }
    });
    
};