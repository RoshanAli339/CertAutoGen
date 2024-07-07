import generateCert from "./certGen.js"


generateCert(
	'./images/cert.jpg',
	'Magnolia Script.otf',
	80,
	[
		{
			name: "Name",
			text: "Roshan Ali Shaik",
			coords: [880, 640]
		},
		{
			name: "Department",
			text: "CSE",
			coords: [360, 720]
		}
	]
)