/**
 * Created by philip on 02/02/16.
 */

module.exports = function(app) {
    var Service = app.get('services').Authorization;

    return {

        login: function(req, res) {

            var data = req.body;
            Service.login(data)
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
