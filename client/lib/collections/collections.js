Devices = new Meteor.Collection(null);
Locations = new Meteor.Collection(null);

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
								}],
					location: {
								latitude: 40.78137,
								longitude: -73.96590
							  }
				});
				
Devices.insert({ 
					name: "Window Lights",
					components: [{
									name: "Window Light",
									type: "light",
									properties: {
													'power': true
												}
								}],
					location: {
								latitude: 40.78143,
								longitude: -73.96716
							  }
				});
				
Locations.insert({
					name: "Bedroom",
					x1: -73.96616,
					y1: 40.78154,
					x2: -73.96561,
					y2: 40.78115
				 });
				 
Locations.insert({
					name: "Kitchen",
					x1: -73.96753,
					y1: 40.78162,
					x2: -73.96699,
					y2: 40.78125
				 });