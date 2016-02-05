/**
 * Created by philip on 03/02/16.
 */

module.exports = function(app) {
    var Service = app.get('services').Contact;

    return {

        save: function(req, res) {

            var data = req.body;
            Service.save(data)
                .then(function(results) {
                    res.status(200).json( results );
                })
                .fail(function(err) {
                    console.log('err', err, err.toString());
                    res.status(500).send(err.toString());
                });
        },
        delete:function(req, res) {

            var id = req.params.id;

            Service.delete( id )
                .then(function(results) {
                    res.status(200).send('ok');
                })
                .fail(function(err) {
                    console.log('err', err, err.toString());
                    res.status(500).send(err.toString());
                });
        },
        get: function(req, res) {

            Service.get( )
                .then(function(results) {
                    res.status(200).json( results );
                })
                .fail(function(err) {
                    console.log('err', err, err.toString());
                    res.status(500).send(err.toString());
                });
        }
    };
};

