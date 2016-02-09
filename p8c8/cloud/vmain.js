// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("RegisterVisit", function(request, response) 
{
			Parse.Cloud.useMasterKey();

			console.log(request.params.MemberId);
			// check for request.params variable
			var Query = new Parse.Query(Parse.User);
			var id = parseInt(request.params.MemberId);
			Query.equalTo("MemberId", id);
			//Query.equalTo("MemberId", 10001);

			Query.find().then(function(userIsMember) {

			        if (userIsMember.length === 0)
			        {
			            return Parse.Promise.error("Member doesn't with id "+ request.params.MemberId +" exist");
			        }
			        else
			        {
			            return Parse.Promise.as(userIsMember[0]);
			        }
			}).then(function(mmbr) {
			        
			        console.log('hi');
			        var vQuery = new Parse.Query("Visits");
					vQuery.equalTo("Member", {
                     			"__type":"Pointer",
                     			"className":"_User",
                     			"objectId":mmbr.id
					 });


					vQuery.equalTo("entity", {
                     			"__type":"Pointer",
                     			"className":"entity",
                     			"objectId":"p1fgQWnGIh"
					 });
					
					var now = new Date();
					
					vQuery.find().then(function(LastVisit) {
					 
					 	var Visit = Parse.Object.extend("Visits");
                     	var visit= new Visit();

                     	if (LastVisit.length === 0)
                        {
                            visit.set("Member", {
                     			"__type":"Pointer",
                     			"className":"_User",
                     			"objectId":mmbr.id
					 		});

   							visit.set("entity", {
                            			"__type":"Pointer",
                     					"className":"entity",
                     					"objectId":"p1fgQWnGIh"
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
                                visit.set("counter", 1);
                            }
                            else
                            {
                                visit.set("counter", visit.get("counter") + 1);
                            }
                        }
					     
					    visit.save(null, {
             					success: function(visit) {
             						//msg = "Visit Registered " + mmbr.id + " Visit Count = " + visit.get("counter");
             						//response.success(Parse.Promise.as("Visit Registered : Visit Count = " + visit.get("counter")));
             						response.success("Visit Registered : Cycle  " + visit.get("cycles") + " Visit Count = " + visit.get("counter"));
	               				},
             					error: function(visit,error) {
									//return Parse.Promise.error("Error Registering Vist for member "+ request.params.MemberId);
									response.error(error);
             					}
						}); //.then (function() {response.success("yess 1");});
					}); //.then (function() {response.success("yess 2");});
			}),function (error) { response.error(error); }
});