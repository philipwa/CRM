/**
 * Created by philip on 01/02/16.
 */

// Loader utility for dependency injection. Finds the class according to the
// passed "name" parameter, then injects the rest of the dependencies

module.exports = function() {

    // utility for loading a controller and injecting indicated dependencies
    function loader(/* name, dependency, dependency, ... */) {
        var name = Array.prototype.shift.apply(arguments);
        var builder = require(loader.storage + name);
        return construct(builder, arguments);
    }

    function construct (constructor, args) {
        function Ctor () {
            return constructor.apply(this, args);
        }
        Ctor.prototype = constructor.prototype;
        return new Ctor();
    }

    // base storage path, can be set externally if so desired to find
    // controllers in different paths
    loader.storage = './';

    return loader;
};

