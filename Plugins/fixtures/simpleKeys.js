module.exports = function(db,Fixture,fixtureMeta,callback){
  // read the singles
  var fixtureCounter = 0;
  var fixturesLength = fixtureMeta.length

  // console.log(fixtureMeta);

  function feedFixturesSimple(fixtureMeta){
    db[Fixture.model].create(fixtureMeta[fixtureCounter].simpleKeys).exec(function(err, created){
      // console.log(created);
      if(fixtureCounter === fixturesLength - 1){
        callback()
      }else{
        fixtureCounter ++
        feedFixturesSimple(fixtureMeta);
      }
    })
  }

  feedFixturesSimple(fixtureMeta)
}
