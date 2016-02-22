var fs = require("fs")
var counter = 0;


module.exports = {
	link:function(resolver,collections,rootDir,collectionItem){
		collections.map(function(collection){
		        var versionDir = rootDir + "/" + collection
		        var mutationDir = rootDir + "/" + collection + "/" + "Mutations"
		        var Schema = rootDir + "/" + collection + "/Schema"
		        var Fixture = rootDir + "/" + collection + "/Fixtures"


		        var mutationFolder = {
		        	version:collectionItem.version,
		        	collection:collection
		        }

		        resolver.result.mutationFolders.push(mutationFolder)


		        resolver.mutations.dirs.push(mutationDir)
		})
	},
	peepItems:function(resolver,mutations,rootDir,collection,version){

		 if(mutations){
			 // go through mutations and store them
			 mutations.map(function(mutation){
				 var mutationTrimmed = mutation.split(".")[0]

				 var mutationLink = rootDir + "/" + mutationTrimmed

						 resolver.mutations.items.push(mutationLink)

						 var mutation = {
							 version:collection.version,
							 collection:collection.collection,
							 mutation:mutationTrimmed,

						 }
						 resolver.result.mutations.push(mutation)
				 })
		 }else{
			//  console.log("mutations were not recieved by the" )
		 }



	},
	peep:function(resolver,version,callback){

		var mutationLink = resolver.mutations.dirs[counter];
		var collection = resolver.result.mutationFolders[counter]
		if(collection){
			//avoid sending an undefined value/... TODO :investigate why the undefined is there
			resolver.result.schemas.push(collection)
			resolver.result.fixtures.push(collection)
		}

		var self = this;
		if (mutationLink) {
			// console.log(collection.version)
			fs.readdir(mutationLink,function(err,mutations){
				self.peepItems(resolver,mutations,mutationLink,collection,version);
				if(counter != resolver.mutations.dirs.length){
					counter += 1;
					self.peep(resolver,version,callback)
				}

				if(counter === resolver.mutations.dirs.length){
					callback(resolver)
				}
			})
		};
  }
}
