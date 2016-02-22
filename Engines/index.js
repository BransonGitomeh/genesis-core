var fs = require("fs");
var path = require("path")

var resolver = {
	versions:{
		dirs:[],
		items:[],
		link:require("./resolver/versions").link,
		peep:require("./resolver/versions").peep
	},
	collections:{
		dirs:[],
		items:[],
		link:require("./resolver/collections").link,
		peep:require("./resolver/collections").peep
	},
	handlers:{
		dirs:[],
		items:[]
	},
	mutations:{
		dirs:[],
		items:[],
		link:require("./resolver/mutations").link,
		peep:require("./resolver/mutations").peep,
		peepItems:require("./resolver/mutations").peepItems
	},
	result:{
		versions:[],
		handlers:[],
		collections:[],
		schemas:[],
		fixtures:[],
		mutationFolders:[],
		mutations:[]
	},
	callback:function(){
		console.log("done reading this stuff")
	}
}

module.exports = function(callback){
    var versionsDir = "./Endpoints/";
    var handlers = []
    return fs.readdir(versionsDir,function(err,versions){
      if(err) console.log(err)

    	resolver.versions.link(resolver,versions,versionsDir)

      var startTime = new Date()

      resolver.versions.peep(resolver,function(results){
        if(err) console.log(err)

        if(versions){callback(results)}
      })
    })
}
