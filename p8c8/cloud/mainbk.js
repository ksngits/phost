// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("RegisterVisit", function(request, response) 
{
			// check for request.params variable
			var Query = new Parse.Query(Parse.User);
			Query.equalTo("MemberId", request.params.MemberId);

			Query.find().then(function(userIsMember) {
			        if (userIsMember.length === 0)
			            return Parse.Promise.error("Member doesn't with id "+ request.params.MemberId +" exist");
			        else
			        {
			            return Parse.Promise.as(userIsMember[0]);
			        }
			}).then(function(mmbr) {
                     
                     var vQuery = new Parse.Query("Visits");
                     vQuery.equalTo("user", {
                     			"__type":"Pointer",
                     			"className":"User",
                     			"objectId":mmbr.id
					 });

					
					 vQuery.equalTo("entity", {
                     			"__type":"Pointer",
                     			"className":"entity",
                     			"objectId":"p1fgQWnGIh"
					 });
					
					vQuery.find().then(function(LastVisit) {
						 var Visit = Parse.Object.extend("Visits");
                     	 var visit= new Visit();
                         if (LastVisit.length === 0)
                         {
                            visit.set("entity", 
                            		{
                            			"__type":"Pointer",
                     					"className":"entity",
                     					"objectId":"p1fgQWnGIh"
                     				}
							);
                            
                            visit.set("Member", {
                     			"__type":"Pointer",
                     			"className":"User",
                     			"objectId":mmbr.id
					 		});
                            
                            visit.set("cycles",0);
                            visit.set("counter",1);
                         }
                         else
                         {
                            visit = LastVisit[0];
                            if ( visit.get("counter") === 9)
                            { 
                                visit.set("cycles", visit.get("cycles") + 1);
                                visit.set("counter", 0);
                            }
                            else
                            {
                                visit.set("counter", visit.get("counter") + 1);
                            }
                         }
					     return Parse.Promise.as(visit);
                 	}).then(function(visit) { 
							visit.save(null,{}).then(
             					function(visit) {
										return Parse.Promise.as(visit);
	               				},
             					function(visit,error) {
             						 console.log(error);
             					 	return Parse.Promise.error("Error Registering Vist for member "+ request.params.MemberId);
             					}
                 			);
					})
				}).then(function(visit) {
					response.success("Visit Registered Sucessfully " + visit.get("cycles") + " --" + visit.get("counter"));	
				 }
				),function (error) {
						response.error(error);
				}

});

 /**	
                         var promises =[];
                         promises.push(visit.save());

                         Parse.Promise.wait(promises).then(function(){
						 		//this is the success
						 		// take a look at what was passed here:
						 		return Parse.Promise.as("Registered Visit");
							}, function(){ 
						 		// this is the error function
						 		return Parse.Promise.error("Failed to register visit");
							});
**/