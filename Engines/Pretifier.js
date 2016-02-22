module.exports = function(QueryToken,RequestReceiveTime,data,Config){
    	   ResolveTime = Math.abs(new Date() - RequestReceiveTime) + "(Ms)";

          var responce = {}

          if(Config.apiStats === !false){
            if(QueryToken.rangeStart){
              responce.range = QueryToken.rangeStart + "-" + QueryToken.rangeEnd
            }


            responce.data = data,
            responce.stats = {
              RequestReceiveTime : RequestReceiveTime,
              RequestResolveTime : new Date(),
              timeTaken : ResolveTime
            }//decorate responce object with stats of entire query process


          }else{
            if(QueryToken.rangeStart){
              responce.range = QueryToken.rangeStart +  "-" +  QueryToken.rangeEnd
            }

            responce.data = data

          } //respond with an object that does not have the api statistics

          // show on console
          // console.log(QueryToken.QueryFields.length + " QueryItems (Type: " + QueryToken.QueryType + ") (Target: " + QueryToken.QueryTarget + ") Completed in " + ResolveTime);

          return responce;
}
