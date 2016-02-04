
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("RegisterVisit", function(request, response) 
{
			 var id = request.params.MemberId;
			 
			 getUser(id).then
			 (
				//function(user) { if (user.length > 0 ) response.success(user); else response.error("User does not exist"); },
				//function(error){ reponse.error("Hard Error");  }

				function(user) { if (typeof user === 'undefined') response.error("Missing User"); 
								 else 
									response.success(user);
							   },
				function(error){ reponse.error("hard error");  }

			 );




});

function getUser(id)
{
	var userQuery = new Parse.Query(Parse.User);
	userQuery.equalTo("MemberId", id);
	return userQuery.first
	(
		{
			success: function(user) { return user;},
			error:function(error) { return error; }
		}
	);
}

function UpdateVist(MemberId)
{
	var query = new Parse.Query(Visits);
}