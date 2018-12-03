import wixWindow from 'wix-window';
import wixData from 'wix-data';
import {session} from 'wix-storage';

function merge(guy1, guy2){
	const commonFrees = [];
	for(let i=0; i<guy1.length; i++)
	{
		for(let j=0; j<guy2.length; j++)
		{
			const latestStart = guy1[i][0] > guy2[j][0] ? guy1[i][0] : guy2[j][0];
			const earliestEnd = guy1[i][1] < guy2[j][1] ? guy1[i][1] : guy2[j][1];
			if(earliestEnd > latestStart){
				commonFrees.push([latestStart, earliestEnd]);
			}
		}
	}
	return commonFrees
}

function getTomorrow() {
	var d = new Date();
	d.setDate(d.getDate() + 1);
	let month = '' + (d.getMonth() + 1);
	let day = '' + d.getDate();
	let year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

$w.onReady(function () {
	//TODO: write your page related code here...
	wixWindow.getCurrentGeolocation()
		.then( (obj) => {
			let timestamp = obj.timestamp;                  // 1495027186984
			let latitude = obj.coords.latitude;             // 32.0971036
			let longitude = obj.coords.longitude;           // 34.774391099999995
			wixData.get("squeezeUsers", session.getItem("userId"))
				.then( (results) => {
					const updateData = results; //see item below
					let notifs = updateData.notification;

					if (notifs === undefined || (typeof notifs === 'object' && Object.keys(notifs).length === 0) || notifs === ""){
						console.log(notifs);
					}
					updateData.latitude = latitude;
					updateData.longitude = longitude;
					console.log(updateData);
					wixData.update("squeezeUsers", updateData)
						.then( (res) => {
							console.log("updated", res); //see item below
						} )
						.catch( (err) => {
							console.log(err);
						} );
				} )
				.catch( (err) => {
					let errorMsg = err;
				} );
		} )
		.catch( (error) => {
			let errorMsg = error;
		});

$w("#button2").onClick( (event) => {

	let email = $w("#input1").value;
	let keyword = $w("#input3").value;
	let location = $w("#dropdown1").value;
	const tomorrow = getTomorrow();
	wixData.get("squeezeUsers", session.getItem("userId"))
		.then((res) => {
			const myEmail = res.email;
			const myLocation = {lat: res.latitude, lng: res.longitude};
			//for now we just want tomorrow's free time
			const myFreeTime = res.freeTimes[tomorrow];
			wixData.query("squeezeUsers")
			.eq("email", email)
			.find()
			.then( (results) => {
				let userInfo = results._items[0];
				const theirLocation = {lat: userInfo.latitude, lng: userInfo.longitude};
				//just tomorrow's free time for now
				const theirFreeTime = userInfo.freeTimes[tomorrow];

				const sendLat = (parseFloat(theirLocation.lat) + parseFloat(myLocation.lat))/2;
				const sendLng = (parseFloat(theirLocation.lng) + parseFloat(myLocation.lng))/2;

				const mergedFreeTimes = merge(myFreeTime, theirFreeTime);
				if(mergedFreeTimes.length > 0){
					//sketchy for now
					const startTime = mergedFreeTimes[0][0] >= 10 ? String(mergedFreeTimes[0][0]) : ('0' + String(mergedFreeTimes[0][0]));
					const endTime = mergedFreeTimes[0][0] + 1 >= 10 ? String(mergedFreeTimes[0][0] + 1) : ('0' + String(mergedFreeTimes[0][0] + 1));

					const startTimeFormatted = tomorrow + "T" + startTime + ":00:00-05:00";
					const endTimeFormatted = tomorrow + "T" + endTime + ":00:00-05:00";

					console.log(endTime);

					if(endTime !== '24'){
						console.log(startTimeFormatted);
						console.log(endTimeFormatted);

						const token = session.getItem("token");

						var url = ("https://1e031eec.ngrok.io/api/submit?type=" + location + "&keyword=" + keyword + "&lat=" + 
						sendLat + "&lng=" + sendLng + "&startTime=" + startTimeFormatted + "&endTime=" + endTimeFormatted + "&toEmail=" + email + "&token=" + token)
						fetch(url, {method: "get"})
							.then((response) => {
								return response.json()
							}).then((resp) => {
								console.log("got location response", resp);
								let notif = {
									fromEmail: myEmail,
									location: resp.locationName,
									type: "invite",
									startTime: mergedFreeTimes[0][0],
									endTime: mergedFreeTimes[0][0] + 1,
									startTimeFormatted: startTimeFormatted,
									endTimeFormatted: endTimeFormatted,
									date: tomorrow
								}

								userInfo.notification = notif;

								wixWindow.openLightbox("Sent")
					
								wixData.update("squeezeUsers", userInfo)
									.then( (r) => {
										console.log("updated", r); //see item below
									} )
									.catch( (err) => {
										console.log(err);
									} );
								})
					}
					else{
						console.log('unavail');
						wixWindow.openLightbox("Unavailable");
					}
				}
				else{
					console.log('unavail');
					wixWindow.openLightbox("Unavailable")
				}

			} )
			.catch( (err) => {
				console.log("couldnt find");
			} );

		})
} );

$w('#iconButton1').onClick( (event) => {
	wixWindow.openLightbox("notifications")
})

});