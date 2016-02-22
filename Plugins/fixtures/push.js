var seed = require('./seed');

var feedFixturesSimple = require("./simpleKeys.js")
var feedFixturesOneToOne = require('./simpleOneToOne');
var feedFixturesOneToMany = require('./simpleOneToMany');

function ModuleAvailable(name){
  try{
    require(name)
    return true
  }
  catch(e){}
  return false
}



module.exports = function(db,results,testFixtures,callback){
  var Fixtures = []
  testFixtures.map(function(x){
      var reqString = "../../../Endpoints/" + x.version + "/collections/" + x.collection + "/Fixtures"

      if(ModuleAvailable(reqString)){
        Fixtures.push(require(reqString))
      }
    }
  )

  var reqUrl = ""
  var fixtureCounter = 0;
  var fixtureLength = Fixtures.length
  // console.log(fixtureLength);
  var allFixturesLength = 0

  function seedFixtures(){
    var Fixture = Fixtures[fixtureCounter];

    var fixtureMeta = seed(db,Fixture)

   // console.log(fixtureMeta[fixtureCounter])

   //  // for(x in fixtureMeta[1]){
   //  //   console.log(fixtureMeta[1][x])
   //  // }
   //  console.log("-----------------------------")

    feedFixturesSimple(db,Fixture,fixtureMeta,function(){
        feedFixturesOneToOne(db,Fixture,fixtureMeta,function(){
          feedFixturesOneToMany(db,Fixture,fixtureMeta,function(){
            if(fixtureCounter === fixtureLength - 1){
              //call this callback after passing through all fixtures
              callback(Fixture);

            }else{
              fixtureCounter ++
              seedFixtures()
            }
          })
        })
    });
  }

  seedFixtures()
}
