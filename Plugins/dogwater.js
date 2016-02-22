// const config = require("../../config/app")

module.exports = function(models,fixtures,adapters,connections){
    var plugin = {
        register: require('dogwater'),
        options: {
            adapters: adapters,
            connections: connections,
            models: models,
            fixtures: fixtures
          }
    }

    // Schemas.map(function(schema){
    //     var schemalink = "../../Endpoints/" + schema.version + "/collections/" + schema.collection + "/Schema"
    //     var fixturelink = "../../Endpoints/" + schema.version + "/collections/" + schema.collection + "/Fixtures"

    //     //pass in schemas in an already required format ans schema's too
    //     plugin.options.models.push(require(schemalink))

    //     if(config.fixtures){ //if fixtures are turned off in config
    //       console.log(require(fixturelink)());
    //         plugin.options.fixtures.push(require(fixturelink)())
    //     }
    // });

    // Fixtures.map(function(fixture){
    //     var schemalink = "../../Endpoints/" + schema.version + "/collections/" + schema.collection + "/Schema"
    //     var fixturelink = "../../Endpoints/" + schema.version + "/collections/" + schema.collection + "/Fixtures"

    //     //pass in schemas in an already required format ans schema's too
    //     plugin.options.models.push(require(schemalink))

    //     if(config.fixtures){ //if fixtures are turned off in config
    //       console.log(require(fixturelink)());
    //         plugin.options.fixtures.push(require(fixturelink)())
    //     }
    // });

    return plugin
}
