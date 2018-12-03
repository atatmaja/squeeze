import {fetch} from 'wix-fetch';
import wixLocation from 'wix-location';
import wixData from 'wix-data';
import {session} from 'wix-storage';

$w.onReady(function () {

	if(wixLocation.url.includes("code"))
	{
		let query = wixLocation.query;
		var url = "https://1e031eec.ngrok.io/api/signInInfo?code=" + query.code 
		fetch(url, {method: "get"}).then((res) => {
			return res.json()
		}).then((resp) =>{
			session.setItem("userId", resp.info.id);
			session.setItem("token", resp.info.token.access_token);
			wixData.query("squeezeUsers")
				.eq("_id", resp.info.id)
				.find()
				.then( (results) => {
					if(results._items.length === 0){
						const insertData = {
							email: resp.info.email,
							_id: resp.info.id,
							freeTimes: resp.info.freeTimes
						}
						wixData.insert("squeezeUsers", insertData)
							.then( (res) => {
								console.log("inserted", res); //see item below
								wixLocation.to("/home");
							} )
							.catch( (err) => {
								console.log(err);
							} );
					}
					else{
						const updateData = results._items[0];
						updateData.freeTimes = resp.info.freeTimes;
						wixData.update("squeezeUsers", updateData)
							.then( (res) => {
								console.log("updated", res); //see item below
								$w("#iconButton2").show();
								$w("#iconButton1").show();
								wixLocation.to("/home");
							} )
							.catch( (err) => {
								console.log(err);
							} );
					}
				} )
				.catch( (err) => {
					console.log("error", err)
				} );
				
		})
	}

	$w("#button1").onClick( (event) => {
		fetch("https://1e031eec.ngrok.io/api/signin", {method: "get"}).then((res) => {
			return res.json()
		}).then((resp) =>{
			wixLocation.to(resp.url);
		})

	} );

});