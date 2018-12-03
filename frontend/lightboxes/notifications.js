import wixData from 'wix-data';
import {session} from 'wix-storage';
import wixWindow from 'wix-window';

$w.onReady(function () {
	//Initialize your widget here. If your widget has properties, this is a good place to read their values and initialize the widget accordingly.
	$w("#text5").hide();
	$w("#button4").hide();
	$w("#button3").hide();
	wixData.get("squeezeUsers", session.getItem("userId"))
		.then( (results) => {

			let userData = results;
			let notifs = userData.notification
			console.log("notifs obj", notifs);

			if (notifs === undefined || (typeof notifs === 'object' && Object.keys(notifs).length === 0) || notifs === ""){
				$w("#text5").text = "​ ";
				$w("#text5").show();
			}
			else{
				$w("#text5").text = "​You got a squeeze!";
					$w("#text5").show();
					$w("#button4").show();
					$w("#button3").show();
				let dummy = "";
				if (notifs.type === 'invite'){
					const start = notifs.startTime > 12 ? String(notifs.startTime - 12) + "pm" : notifs.startTime === 12 ? String(notifs.startTime) + "pm" : String(notifs.startTime) + "am";
					const end = notifs.endTime > 12 ? String(notifs.endTime - 12) + "pm" : notifs.endTime === 12 ? String(notifs.endTime) + "pm" : String(notifs.endTime) + "am";
					dummy = dummy + "Invite from "+ notifs.fromEmail + " to go to "+ notifs.location + " from " + start + " to " + end + " on " + notifs.date + "\n";
				}
				$w("#text1").text = dummy;
			
			}
		})

	$w("#button4").onClick( (event) => {
		console.log(session.getItem("userId"))	
		wixData.get("squeezeUsers", session.getItem("userId"))
			.then( (results) => {
				console.log(results);
				const notif = results.notification;
				const token = session.getItem("token");
				const url = "https://1e031eec.ngrok.io/api/accept?" + "token=" + token + "&startTime=" + notif.startTimeFormatted + "&endTime=" + notif.endTimeFormatted + "&locationName=" + notif.location + "&toEmail=" + notif.fromEmail;
				fetch(url, {method: "get"})
					.then((res) => {
						return res.json();
					})
					.then((resp) => {
						const newRecord = Object.assign({}, results);
						newRecord.freeTimes = resp.freeTimes;
						newRecord.notification = "";
						//deleting notif
						results.notification = "";
						console.log("new record", newRecord);
						console.log("free times from req", resp.freeTimes)
						wixData.update("squeezeUsers", newRecord)
							.then( (r) => {
								//console.log("updated", r); //see item below
								wixWindow.lightbox.close();
								wixWindow.openLightbox("squeezeAccept")
								$w("#text1").text = "No notifications right now.";
							} )
							.catch( (err) => {
								console.log(err);
							} );
					})
			})
	})

	$w("#button3").onClick( (event) => {	
		wixWindow.lightbox.close();
	})
})