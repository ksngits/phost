// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("RegisterVisit", function(request, response) 
{
			Parse.Cloud.useMasterKey();

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
                    
					var MyEntity = Parse.Object.extend("entity"); var myEntity = new MyEntity(); myEntity.id="p1fgQWnGIh";
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
					
					var now = new Date();
					
					vQuery.find().then(function(LastVisit) {

					 
						 var Visit = Parse.Object.extend("Visits");
                     	 var visit= new Visit();

                     	 if (LastVisit.length === 0)
                         {
                            visit.set("Member", {
                     			"__type":"Pointer",
                     			"className":"User",
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
                                visit.set("counter", 0);
                            }
                            else
                            {
                                visit.set("counter", visit.get("counter") + 1);
                            }
                         }
					     
					     console.log("b4 Save");
					     visit.save(null, {
             					success: function(visit) {
									return Parse.Promise.as("Visit Registered 1");
	               				},
             					error: function(visit,error) {
									return Parse.Promise.error("Error Registering Vist for member "+ request.params.MemberId);
             					}
						 }).then(function(visit){
							return Parse.Promise.as("Visit Registered 2");
						 });
					}).then(function() { response.success('Done');});
					}),function (error) {
						response.error(error);
				}
});