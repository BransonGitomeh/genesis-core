module.exports = {
  SingleObject:function(QueryToken,db,sendDataForFilteringCB){
    var Object = db[QueryToken.QueryTarget];

    var queryObject = {}; queryObject[QueryToken.ParamKey] = QueryToken.ParamValue

    Object.findOne(queryObject, function(err, item) { //find the data in the database

      if(err){
        console.log(err);
      }

      if(item){
        console.log(QueryToken.QueryTarget + " Record found of  with  _id(" +  QueryToken.ParamValue + ")");
        sendDataForFilteringCB(item) //send the data up to be filtered
      }else{
        console.error("Database returned Objecttype " + typeof(item));

        if(typeof(item) === "undefined"){
          console.log("no " + QueryToken.QueryTarget + " Record found of  with  _id(" +  QueryToken.ParamValue + ")");
        }else{
          console.log(typeof(item));
        }
      }
   })
  console.log(" ");
  },

  MultipleObjects:function(QueryToken,db,sendDataForFilteringCB){
    // var Object = db.collection(QueryToken.QueryTarget);

    var RangeStart = QueryToken.rangeStart;
    var RangeEnd = QueryToken.rangeEnd;
    var RangeLength = RangeEnd - RangeStart;

    var Object = db[QueryToken.QueryTarget]

    Object.find().skip(RangeStart).limit(RangeLength).exec(function(err, objects) { //find the data in the database
      sendDataForFilteringCB(objects) //send the data up to be filtered
    })
  }
}
