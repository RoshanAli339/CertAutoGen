import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { generateZip } from './generateZip.js'
import { generateSample } from './certGen.js'

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

console.log('process.env.FRONTEND_URL:', process.env.FRONTEND_URL)
const corsOptions = {
	origin: [process.env.FRONTEND_URL, 'https://cert-gen-mu.vercel.app/'],
	// origin: 'http://localhost:5173',
	methods: ['GET', 'POST'],
	credentials: true,
}

app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL)
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
	next()
})

app.get('/api/', (req, res) => {
	res.json({
		status: 'Get request successfull!',
	})
})

app.post('/api/sample2', upload.fields(fileFields), async (req, res) => {
	console.log('Request: ', req.body)
	try {
		const certificatePath = req.files.certificate[0].path
		const fontPath = req.files.font[0].path
		const csvPath = req.files.csv[0].path

		const fontSize = req.body.fontSize
		const fieldsLength = req.body.fieldsLength

		const coordinates = {}

		for (let i = 0; i < fieldsLength; i++) {
			coordinates[req.body[`propertyName-${i}`]] = [
				req.body[`xcoord-${i}`],
				req.body[`ycoord-${i}`],
			]
		}

		var genCert = await generateSample(
			certificatePath,
			fontPath,
			fontSize,
			coordinates
		)

		const absolutePath = path.resolve(genCert)
		res.sendFile(absolutePath, async (err) => {
			if (err) {
				console.log(err)
				res.status(500).send('Error sending file')
			} else {
				console.log('File sent: ', genCert)
				const filesToDelete = [
					absolutePath,
					certificatePath,
					fontPath,
					csvPath,
				]
				filesToDelete.forEach((filePath) => {
					fs.unlink(filePath, (err) => {
						if (err)
							console.error(
								`Error deleting file ${filePath}:`,
								err
							)
					})
				})
			}
		})
	} catch (error) {
		console.log('error sending sample file:', error)
	}
})

app.post('/api/sample', upload.fields(fileFields), async (req, res) => {
	console.log('Request: ', req)
	try {
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
		res.sendFile(absolutePath, async (err) => {
			if (err) {
				console.log(err)
				res.status(500).send('Error sending file')
			} else {
				console.log('File sent: ', genCert)
				console.log('Error: ', err)
				const filesToDelete = [absolutePath, certificatePath, fontPath]
				filesToDelete.forEach((filePath) => {
					fs.unlink(filePath, (err) => {
						if (err)
							console.error(
								`Error deleting file ${filePath}:`,
								err
							)
					})
				})
			}
		})
	} catch (error) {
		console.log('error sending sample file:', error)
	}
})

app.post('/api/zip', upload.fields(fileFields), async (req, res) => {
	const certificatePath = req.files.certificate[0].path
	const fontPath = req.files.font[0].path
	const csvPath = req.files.csv[0].path
	console.log(csvPath)

	const size = parseInt(req.body.fontSize)
	const primaryField = req.body.primary
	const fieldsLength = parseInt(req.body.fieldsLength)
	console.log(`Primary field from req: ${req.primary}`)

	const coordinates = {}

	for (let i = 0; i < fieldsLength; i++) {
		coordinates[req.body[`propertyName-${i}`]] = [
			req.body[`xcoord-${i}`],
			req.body[`ycoord-${i}`],
		]
	}
	var zipPath = await generateZip(
		certificatePath,
		fontPath,
		size,
		coordinates,
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
