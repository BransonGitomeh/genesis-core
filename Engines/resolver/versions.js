var fs = require("fs")
var counter = 0;

module.exports = {
	link:function(resolver,versions,rootDir){
			versions.map(function(version){
		        var versionDir = rootDir + version

		        resolver.result.versions.push(version)
		        resolver.versions.dirs.push(versionDir)
		    })
	},
	peep:function(resolver,callback){
			   // console.log(callback)           	   
           	   var self = this;
           	   var length = resolver.versions.dirs.length;
           	   var versionLink = resolver.versions.dirs[counter]

           	   var version = resolver.result.versions[counter]

           	   if(versionLink){ //to avoid giving fs an empty value
		           fs.readdir(versionLink,function(err,contents){
		           		if(version){
		           			resolver.collections.link(resolver,contents,counter,version)
		           		}
		           		
			           	if(counter != length){
			           		counter += 1;
			           		self.peep(resolver,callback)
			           	}

			            if(counter === length){
			           		resolver.collections.peep(resolver,callback)
			           	}

		           })
		        }
           
	}
	
}