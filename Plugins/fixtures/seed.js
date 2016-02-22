module.exports = function(db,Fixture){
  var counter = 0;
  var makeInstitutionsCounter = 0;
  var fixtureMeta = [];

  for(singleFixture in Fixture.items){ //read the records 1 by one
      var cache = {
        simpleKeys:{},
        oneToOne:[],
        oneToMany:[],
        collections:[]
      }

      // console.log(cache.simpleKeys);

      for(FixtureHeader in Fixture.items[singleFixture]){ //read the keys of the fields
        /*
        *ie [id,age,foodLike] this is simmilar to Object.keys(obj)
        */

        for (definitionItem in db[Fixture.model]._attributes){ //look at the attributes defined in the schema one by one

          /*
          *check if there is an attribute like that for the key we are looking at
          *ie key for fixture "name" look for an attribute called name...if you find..proceed
          *
          *this prevents the module from reading records from fixtures that do not exist in the attibutes ITFP
          */

          if(definitionItem === FixtureHeader){
            /*
            *if its a dead simple record
            */
            var decideType = require('./decideType');
            decideType(db,Fixture,cache)
          }


        }

      }

      /*
      *i want to heavily assume that this parsing is sync not async
      *so im passing the objects made to an array
      *
      *push the items with no relations to be used to make single objects, relations will be added later
      */

      fixtureMeta.push(cache)
  }
  return fixtureMeta;
}
