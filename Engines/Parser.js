// Todo
// extend the query lang for ranges to include sorting order

module.exports = {
  parse:function(QueryString){
    return root(tokenize(QueryString))
  }
}

var queryMeta = {}

function root(tokens) {
      // querytype checks
      // check if its a single value or a range being asked by the query
      if(tokens[0].split(":")[0].split("(")[1] === "range"){
        // inclide that it contains a range
        queryMeta.QueryType="Range"

        queryMeta.rangeStart=tokens[0].split(":")[1].split(")")[0].split("-")[0];
        queryMeta.rangeEnd=tokens[0].split(":")[1].split(")")[0].split("-")[1];
      }else{
        // does not contain a range so include that its a singe query
        queryMeta.QueryType="Unary"
        // check if param has been provided in the first place
        if(tokens[0].split(":")[0].split("(")[1]){
          queryMeta.ParamKey = tokens[0].split(":")[0].split("(")[1];
          queryMeta.ParamValue = tokens[0].split(":")[1].split(")")[0];
        }
      }

      // ObjectType checks
      var OriginalObjectType = tokens[0].split(":")[0].split("(")[0];

      // check if mutation styntax has been used
      if(OriginalObjectType.split("[")[1]){
        queryMeta.QueryType="Mutation"
        queryMeta.QueryTarget = OriginalObjectType.split("[")[0].split("]")[0]
        queryMeta.MutationType = tokens[0].split(":")[0].split("(")[0].split("[")[1].split("]")[0]
      }else{
        //mutation syntax was not used hence its a normal query
        queryMeta.QueryTarget = OriginalObjectType;
      }



    queryMeta.QueryFields = fields(tokens, {index:2})

    // console.log("Parsing--Complete")
    return queryMeta;
}

function fields(tokens, state) {
      var ObjectType = tokens[0].split(":")[0].split("(")[0];

      // check if mutation styntax has been used
      if(ObjectType.split("[")[1]){
        var queryType="mutation"
      }else{
        var queryType="normal"
      }

    var res = []
    //look for relation
    //look for other route thats not a while loop

    while (tokens[state.index] !== '}') {
            if (tokens[state.index + 1] === '{') {
                res.push(relation(tokens, state))
            } else {
                // dig out the params per feild if present
                var paramsArray =[];
                if(tokens[state.index].split("(")[1]){
                  //extract them
                  var params = tokens[state.index].split("(")[1].split(",")
                  params.map(function(param){
                    var paramFull = param.split(")")[0]
                    ParamKey = paramFull.split(":")[0]
                    ParamValue = paramFull.split(":")[1]

                    var paramsSet = {
                      key:ParamKey,
                      value:ParamValue
                    }
                    paramsArray.push(paramsSet)
                    // console.log(paramName + " -> " + ParamValue)
                  })
                  //store them
                  res.push({
                    type: 'field',
                    value: tokens[state.index].split("(")[0],
                    params:paramsArray
                  })
                }else{
                  if(queryType === "normal"){
                    res.push({
                      type: 'field',
                      value: tokens[state.index].split("(")[0],
                    })
                  }else{
                    var statement = tokens[state.index].split("(")[0];
                    var key = statement.split(":")[0];
                    var value = statement.split(":")[1];

                    res.push({
                      type: 'field',
                      key: key,
                      value: value
                    })
                  }
                }

                state.index++


            }
    }
        state.index++
        return res
}

function relation(tokens, state) {
    return {
        type:'relation',
        name: tokens[(state.index++)],
        fields: (state.index++ && fields(tokens, state))
    }
}

var re = /\{|\}|[^{}\s]+/g

function tokenize(query) {
    var res = [], match
    while (match = re.exec(query)) res.push(match[0])
    return res
}
