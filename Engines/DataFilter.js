module.exports = {
  SingleObjectFilter:function(SingleUser,QueryToken,replyFilteredData){

    if(SingleUser){
      var SingleUserFiltered = {}     // cretae a place to hold the objects

      QueryToken.QueryFields.map(function(QueryField){

        SingleUserFiltered[QueryField.value] = SingleUser[QueryField.value]

      })  //compare the existing fields versus the queried fields and pick out the queried fields

      replyFilteredData(SingleUserFiltered,200)     //reply with the selected fields
    }else{
      console.error("Err! undefined object reached the filter");
    }


  },

  MultipleObjectFilter:function(MultipleUsers,QueryToken,replyFilteredData){

        MultipleUsersFiltered = [] //mother store to all foltered records

  			MultipleUsers.map(function(SingleUser){


  				var SingleUserFiltered = {} //store to hold a single user

  				QueryToken.QueryFields.map(function(QueryField){

            SingleUserFiltered[QueryField.value] = SingleUser[QueryField.value]

  				}) //compare fields of that single user versus the fields in the query

  				MultipleUsersFiltered.push(SingleUserFiltered) //push that single user to the larget

  			}) //finish filtering

        replyFilteredData(MultipleUsersFiltered,200) //send via http with status 200...
  }
}
