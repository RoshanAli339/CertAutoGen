import gm from 'gm'
const im = gm.subClass({
	appPath: './magick',
})

export default function generateSample(inputImage, font, size, fieldsCoords) {
	return new Promise((resolve, reject) => {
		var filePath = inputImage.substring(0, inputImage.lastIndexOf('.'))
		var image = im(inputImage).font(font, size)
		for (const [key, value] of Object.entries(fieldsCoords)){
			image = image.drawText(
				value[0],
				value[1],
				"Sample Text"
			)
		}
		filePath = filePath + 'Gen.jpg'
		image.write(filePath, (err) => {
			if(err){
				console.log(err)
				reject(err)
			}
			else {
				console.log("Image successfully created")
				resolve(filePath)
			}
		})
	})
}

// generateCert(
// 	'./images/cert.jpg',
// 	'Magnolia Script.otf',
// 	80,
// 	[
// 		{
// 			name: "Name",
// 			text: "Roshan Ali Shaik",
// 			coords: [880, 640]
// 		},
// 		{
// 			name: "Department",
// 			text: "CSE",
// 			coords: [360, 720]
// 		}
// 	]
// )
