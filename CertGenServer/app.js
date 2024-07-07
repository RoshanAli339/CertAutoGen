import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import generateZip from './generateZip.js'
import generateSample from './certGen.js'

const app = express()
const PORT = 5000

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/') // specify the directory to save files
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		cb(
			null,
			file.fieldname +
				'-' +
				uniqueSuffix +
				path.extname(file.originalname)
		) // save the file with a unique name
	},
})

const upload = multer({ storage: storage })

const fileFields = [
	{ name: 'certificate', maxCount: 1 },
	{ name: 'font', maxCount: 1 },
	{ name: 'csv', maxCount: 1 },
]

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/api/', (req, res) => {
	res.json({
		status: 'Get request successfull!',
	})
})

app.post('/api/sample', upload.fields(fileFields), async (req, res) => {
	const certificatePath = req.files.certificate[0].path
	var fontPath = req.files.font[0].path
	const size = req.body.size
	const fieldsCoords = JSON.parse(req.body.fieldsCoords)

	var genCert = await generateSample(
		certificatePath,
		fontPath,
		size,
		fieldsCoords
	)

	const absolutePath = path.resolve(genCert)
	res.sendFile(absolutePath, (err) => {
		if (err) {
			console.log(err)
			res.status(500).send('Error sending file')
		} else {
			console.log('File sent: ', genCert)
			setTimeout(() => {
				fs.unlink(absolutePath, (err) => {
					if (err)
						console.log('Error in deleting file: ', absolutePath)
				})
				fs.unlink(certificatePath, (err) => {
					if (err)
						console.log('Error in deleting file: ', certificatePath)
				})
				fs.unlink(fontPath, (err) => {
					if (err) console.log('Error in deleting file: ', fontPath)
				})
			}, 10000)
		}
	})
})

app.post('/api/zip', upload.fields(fileFields), async (req, res) => {
	const certificatePath = req.files.certificate[0].path
	const fontPath = req.files.font[0].path
	const csvPath = req.files.csv[0].path
	console.log(csvPath)

	const size = parseInt(req.body.size)
	const primaryField = req.body.primary
	const fieldsCoords = JSON.parse(req.body.fieldsCoords)

	var zipPath = await generateZip(
		certificatePath,
		fontPath,
		size,
		fieldsCoords,
		csvPath,
		primaryField
	)

	const absolutePath = path.resolve(zipPath)
	res.sendFile(absolutePath, (err) => {
		if (err) {
			console.log(err)
			res.status(500).send('Error sending file')
		} else {
			console.log('File sent: ', zipPath)
			setTimeout(() => {
				fs.unlink(absolutePath, (err) => {
					if (err)
						console.log('Error in deleting file: ', absolutePath)
				})
				fs.unlink(certificatePath, (err) => {
					if (err)
						console.log('Error in deleting file: ', certificatePath)
				})
				fs.unlink(fontPath, (err) => {
					if (err) console.log('Error in deleting file: ', fontPath)
				})
				fs.unlink(csvPath, (err) => {
					if (err) console.log('Error in deleting file: ', csvPath)
				})
			}, 10000)
		}
	})
})

app.listen(PORT, (err) => {
	if (err) console.log(err)
	console.log('Server is running on port ' + PORT)
})
