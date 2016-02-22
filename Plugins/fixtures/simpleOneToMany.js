module.exports = function(db,Fixture,fixtureMeta,callback){
  var fixtureoneToManyCounter = 0;
  var fixturesoneToManyLength = fixtureMeta.length

  //to keep track of taking care of the relationships
  var oneManys = fixtureMeta[fixtureoneToManyCounter].oneToMany;
  var oneManysLength = oneManys.length;
  var oneManysCounter = 0
  // console.log("--------------------------------")

  function feedFixturesoneToMany(fixtureMeta){

    //there may be multiple one-one's hence the one-one is an array,thus will store all one-ones of a replationship
    function ExtractoneManys(){
      

      if(oneManysLength != 0 && oneManysLength != "undefined" ){
        // console.log("try " + (oneManysCounter + 1) + " / " + (oneManysLength))
        // console.log(oneManys[oneManysCounter])
        // console.log("--------------------------------")

        var updateObject = {}
        var victimObject = {}

        updateObject[fixtureMeta[fixtureoneToManyCounter].oneToMany[oneManysCounter].relationName] = fixtureMeta[fixtureoneToManyCounter].oneToMany[oneManysCounter].relationalPk
        // console.log(updateObject)

        victimObject.pk = fixtureMeta[fixtureoneToManyCounter].oneToMany[oneManysCounter].victimPk
        // console.log(victimObject)

        if(fixtureMeta[fixtureoneToManyCounter].oneToMany[oneManysCounter].relationName){

            db[Fixture.model].update({id:victimObject.pk},updateObject).exec(function(err, updated){

              // console.log(updated)

              //when done, run the counter for relationship again till you are done with relationships
              //then run the counter to pull in the next fixture

              if(oneManysCounter === oneManysLength - 1){
                // console.log("completed oneManys")

                // run to bring up the next fixture
                if(fixtureoneToManyCounter === fixturesoneToManyLength - 1){
                  // console.log("completed reading all fixtures")
                  callback()
                }else{
                  fixtureoneToManyCounter ++
                  feedFixturesoneToMany(fixtureMeta)
                }

              }else{
                //move to the next relationship
                // console.log("not yet, going another cycle")
                oneManysCounter ++
                // console.log(oneManysCounter)
                ExtractoneManys()
              }
          })
        }
      }
    }

    ExtractoneManys()
    callback()
  }
  feedFixturesoneToMany(fixtureMeta)
}
