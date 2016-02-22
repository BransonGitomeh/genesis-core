module.exports = function(db,Fixture,fixtureMeta,callback){
  var fixtureOneToOneCounter = 0;
  var fixturesOneToOneLength = fixtureMeta.length

  //to keep track of taking care of the relationships
  var oneOnes = fixtureMeta[fixtureOneToOneCounter].oneToOne;
  // console.log(oneOnes)
  var oneOnesLength = oneOnes.length;
  var oneOnesCounter = 0
  // console.log("--------------------------------")

  function feedFixturesOneToOne(fixtureMeta){

    //there may be multiple one-one's hence the one-one is an array,thus will store all one-ones of a replationship
   
    function ExtractOneOnes(){
      

      if(oneOnesLength != 0 && oneOnesLength != "undefined" ){
        // console.log("try " + (oneOnesCounter + 1) + " / " + (oneOnesLength))
        // console.log(oneOnes[oneOnesCounter])
        // console.log("--------------------------------")

        var updateObject = {}
        var victimObject = {}

        updateObject[fixtureMeta[fixtureOneToOneCounter].oneToOne[oneOnesCounter].relationName] = fixtureMeta[fixtureOneToOneCounter].oneToOne[oneOnesCounter].relationalPk
        // console.log(updateObject)
        victimObject.pk = fixtureMeta[fixtureOneToOneCounter].oneToOne[oneOnesCounter].victimPk

        if(fixtureMeta[fixtureOneToOneCounter].oneToOne[oneOnesCounter].relationName){

            db[Fixture.model].update({id:victimObject.pk},updateObject).exec(function(err, updated){

              // console.log(updated)

              //when done, run the counter for relationship again till you are done with relationships
              //then run the counter to pull in the next fixture

              if(oneOnesCounter === oneOnesLength - 1){
                // console.log("completed OneOnes")

                // run to bring up the next fixture
                if(fixtureOneToOneCounter === fixturesOneToOneLength - 1){
                  // console.log("completed reading all fixtures")
                  callback()
                }else{
                  fixtureOneToOneCounter ++
                  feedFixturesOneToOne(fixtureMeta)
                }

              }else{
                //move to the next relationship
                // console.log("not yet, going another cycle")
                oneOnesCounter ++
                // console.log(oneOnesCounter)
                ExtractOneOnes()
              }
          })
        }
      }
    }

    ExtractOneOnes()
    callback()
  }
  feedFixturesOneToOne(fixtureMeta)
}
