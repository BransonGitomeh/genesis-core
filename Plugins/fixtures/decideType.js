module.exports = function(db,Fixture,cache){

    function decideType(db,Fixture,cache){
      //is cought if you have simple keys on your fixtures
      if(!db[Fixture.model]._attributes[definitionItem].model && !db[Fixture.model]._attributes[definitionItem].collection){
        catchSingle(cache,definitionItem,Fixture.items[singleFixture][definitionItem])
      }
      //is cought if you have a fixture field that represents a model
      if(db[Fixture.model]._attributes[definitionItem].model){ //if the deifinition has a model field, its said to have a relation
        //read it as a single {model:"modelName"}
        readModelSimpleRelation(Fixture,cache)
      }
      //is cought if you have a fixture field representing a collection
      //this will only be used to declare many-many relationships since in one-many the "many" node is not used
      if(db[Fixture.model]._attributes[definitionItem].collection){//collection means that this holds many records suitable for many-many
        readCollection(Fixture,cache)
      }

    }

    function catchSingle(cache, key, value){
      cache.simpleKeys[key] = value;
      // console.log(key + " " + value);
    }

    function isModelOnOtherEnd(Fixture){
      var modelName = db[Fixture.model]._attributes[definitionItem].model;
      // console.log(Fixture.model + " " + modelName + "[model]");

      for(x in db[modelName]._attributes){
        // console.log(x);
        if(db[modelName]._attributes[x].collection){
          // console.log(modelName + " " + x + "[collection(" + db[modelName]._attributes[x].collection + ")] via (" + db[modelName]._attributes[x].via + ")");
          return false //this means that on the otther end the relationship is also model
        }

        if(db[modelName]._attributes[x].model){
          // console.log(modelName + " " + x + "[model]");
          return true //this means that on the other end the relationship is collection
        }
      }
    }

    //found a model key--look if other end its collection or if its model
    function readModelSimpleRelation(Fixture,cache){
      //since its model relationship
      // console.log(Fixture.model + " - " + db[Fixture.model]._attributes[definitionItem].model);
      //read the other objects relation to see what its relation to this one is
      if(isModelOnOtherEnd(Fixture)){
        // console.log("this is a one-one relationship");


          //read the values provided in the array of the Fixture so that you can add this
          for(singleFixtureItem in Fixture.items[singleFixture]){
            if(singleFixtureItem === definitionItem){
              // console.log(singleFixtureItem + "[" + db[Fixture.model]._attributes[singleFixtureItem].model + "]" + "(" + Fixture.items[singleFixture][singleFixtureItem] + ")" + " to " + Fixture.model + "(" + Fixture.items[singleFixture].id + ")");

              //store details about this relation in a single object
              var oneToOne = {
                relationshipType:"oneToOne",
                relationName:singleFixtureItem,
                relationModelType:db[Fixture.model]._attributes[singleFixtureItem].model,
                relationalPk:Fixture.items[singleFixture][singleFixtureItem],

                victimModelType:Fixture.model,
                victimPk:Fixture.items[singleFixture].id
              }

              cache.oneToOne.push(oneToOne)
              // cache.oneToOne
              // console.log(singleFixture)
              // console.log(Fixture.items[singleFixture].id);
            }

            // console.log(cache.oneToOne)
          }

        }else{
          //drop the making of the relation and throw this to the many-many relationship function apa
          // console.log("this is a one-many relationship");
          //this should still use the code from above in a diffrent way wince we dont need to set
          //both objects in case of a one-many relationship, but this definately fixed things for many-many path that
          // console.log("this is not a complete one-one, there is a collection on the other end")
          for(singleFixtureItem in Fixture.items[singleFixture]){
            if(singleFixtureItem === definitionItem){
              //make an object that suggests that we need to make a relationship for the other model
              //its still going to be a one-one s
              // console.log(singleFixtureItem)

              var oneToMany  = {
                relationshipType:"oneToMany",
                relationName:singleFixtureItem,
                relationModelType:db[Fixture.model]._attributes[singleFixtureItem].model,
                relationalPk:Fixture.items[singleFixture][singleFixtureItem],

                victimModelType:Fixture.model,
                victimPk:Fixture.items[singleFixture].id
              }

              // cache.oneToMany.push(oneToMany)

              console.dir(cache.oneToMany)
            }
          }
        }
    }

    //found a collection key--look if other end its collection or if its model
    //if its a collection, this is a many to many relation, if its a simple model key then this is a many-one
    function readCollection(Fixture,cache){

      //make an object that has meta on the relationship
      var relatedItems = Fixture.items[singleFixture][definitionItem]
      console.log(relatedItems);

      var model1 = {
        item:Fixture.items[singleFixture].id,
        type:"collection"
      }

      relatedItems.map(function(item){
        var relationshipMeta = {
          relationshipType:"collection",
          // object proposing the relation
          relationalModelType : Fixture.model,
          relationName:definitionItem,
          relationalPk:model1.item,
          relationOtherItems:relatedItems,
          //object being used in the relation
          victimModelType:db[Fixture.model]._attributes[definitionItem].collection,
          victimRelationName:db[Fixture.model]._attributes[definitionItem].via,
          victimPk:item
        }

        // console.log(item);

        cache.collections.push(relationshipMeta)

        console.log( definitionItem + "[" + db[Fixture.model]._attributes[definitionItem].collection + " as " + db[Fixture.model]._attributes[definitionItem].via + "]("+ item + ") - " + Fixture.model + "(" +  model1.item + ")" + "(" + model1.type + ")");
      })
    }

    decideType(db,Fixture,cache)
}
