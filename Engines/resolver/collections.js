var fs = require("fs")
var counter = 0;

module.exports = {
	link:function(resolver,contents,counter,version){
		contents.map(function(content){
		    if(content === "handler.js"){

		      resolver.handlers.items.push(resolver.versions.dirs[counter] + "/" + content)

		      var collection = {
		      	version:version,
		      	file:content
		      }

		      resolver.result.handlers.push(collection)


		    }else if(content === "collections"){
		      
		      var collection = {
		      	version:version,
		      	content:content
		      }
		      
		      resolver.result.collections.push(collection)

		      resolver.collections.dirs.push(resolver.versions.dirs[counter] + "/" + content)
		    }
    	})
	},
    peep:function(resolver,callback){
    		var self = this;
    		var collectionLink = resolver.collections.dirs[counter]
    		var collectionItem = resolver.result.collections[counter]

			if(collectionLink){
				    fs.readdir(collectionLink,function(err,collections){

					       	resolver.mutations.link(resolver,collections,collectionLink,collectionItem)
					           			
					        if(counter != resolver.collections.dirs.length){
							    counter += 1;
							    self.peep(resolver,callback)
							}

							if(counter === resolver.collections.dirs.length){
							    resolver.mutations.peep(resolver,collectionItem,callback)							           	
							}
					})
			}			           			
	}
}