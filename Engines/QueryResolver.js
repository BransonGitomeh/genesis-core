var fs = require("fs");
var path = require("path")

var QueryProcessor = require("./QueryProcessor") //gets the data from the databse
var DataFilter = require('./DataFilter'); //filters the data returns only the fields that have been asked for in the query



module.exports = function(QueryToken,db,mutationModule,replyCB){
              // if its just a request that does not need any specific code...go direct without passing through fs

              if(QueryToken.QueryType  === "Unary"){

                 QueryProcessor.SingleObject(QueryToken,db,function(SingleUser){ //fetch the data
                   DataFilter.SingleObjectFilter(SingleUser,QueryToken,function(filteredData){ //filter the data
                     replyCB(filteredData,200) //pass the filtered data up to be sent to the user
                   });
                 });

              }else if(QueryToken.QueryType  === "Range"){

                QueryProcessor.MultipleObjects(QueryToken,db,function(MultipleUsers){ //fetch the data
                  DataFilter.MultipleObjectFilter(MultipleUsers,QueryToken,function(filteredData){ //filter the data
                    replyCB(filteredData,200) //pass the filtered data up to be sent to the user
                  });
                });

              }else if("Mutation"){
                //if it s a mutation, look for the mutation spec files in the collectiond folder
                // ==================================================

                // var mutationsDir = "./Endpoints/v1/collections/" + QueryToken.QueryTarget + "/Mutations/";

                // fs.readdir(mutationsDir,function(err,mutations){
                //   if(err) console.log(err)
                //   if(mutations){

                //      for(var i = 0; i < mutations.length; i ++){ // look for a mutation that matches the one in the query,

                //         var mutationTrimmed = mutations[i].split(".")[0] //trim mutation to remove .js extention

                //         if(mutationTrimmed === QueryToken.MutationType){
                //           // build a require to the expected folder with the module
                //           var MutationModule = require("../../Endpoints/v1/collections/" + QueryToken.QueryTarget + "/Mutations/" + mutationTrimmed)
                //           // run the constructed module to get to runthe mutation
                //           MutationModule(QueryToken,db,function(resolvedUser,statusCode){
                //             // run the callback to return the mutations responce
                //             replyCB(resolvedUser,statusCode)
                //           },Auth);
                //           // break the loop since the intended module has been found
                //           // prevents the reply from running multiple times and causing an err
                //           break
                //         }
                //       }
                //     }
                // })
                // console.log(mutationModule)


                mutationModule(QueryToken,db,function(resolvedUser,statusCode){
                            // run the callback to return the mutations responce
                            replyCB(resolvedUser,statusCode)
                          });

                console.log("called mutation")
              }
}
