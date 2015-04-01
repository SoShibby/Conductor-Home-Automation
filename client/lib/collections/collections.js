Devices = new Meteor.Collection(null);

//Insert "dummy" device data for now
Devices.insert({ 
					name: "Roof Lights",
					components: [{
									name: "Roof Light",
									type: "light",
									properties: {
													'brightness': 1,
													'power': true
												}
								}]
				});
				
Devices.insert({ 
					name: "Window Lights",
					components: [{
									name: "Window Light",
									type: "light",
									properties: {
													'power': true
												}
								}]
				});