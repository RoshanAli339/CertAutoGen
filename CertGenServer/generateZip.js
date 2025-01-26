import csvParser from 'csv-parser'
import path from 'path'
import fs from 'fs'
import gm from 'gm'
import { once } from 'events'
import { promisify } from 'util'
import archiver from 'archiver'
const im = gm.subClass({
	appPath: './magick',
})

const mkdir = promisify(fs.mkdir)
const access = promisify(fs.access)
const rmdir = promisify(fs.rmdir)
const readdir = promisify(fs.readdir)
const unlink = promisify(fs.unlink)

const readCsv = async (csvPath) => {
	const results = []
	const stream = fs.createReadStream(csvPath).pipe(csvParser())

	stream.on('data', (data) => {
		const cleanData = {}
		for (const [key, value] of Object.entries(data)) {
			let trimmedKey = key.trim()
			let trimmedValue = value.trim()
			cleanData[trimmedKey] = trimmedValue
		}
		results.push(cleanData)
	})

	await once(stream, 'end')
	return results
}

const generateImage = (imagePath, fontPath, fontSize, fieldsCoords, row) => {
	let img = im(imagePath).font(fontPath, fontSize)
	for (const [key, value] of Object.entries(row)) {
		if (fieldsCoords[key]) {
			img = img.drawText(
				fieldsCoords[key][0],
				fieldsCoords[key][1],
				value
			)
		} else {
			console.log(`${key} not found for ${row}`)
		}
	}
	return img
}

const writeImage = (img, outputPath) => {
	return new Promise((resolve, reject) => {
		img.write(outputPath, (err) => {
			if (err) {
				console.log('Error writing file: ', outputPath)
				reject(err)
			} else resolve(outputPath)
		})
	})
}

const zipDirectory = (source, out) => {
	const archive = archiver('zip', { zlib: { level: 9 } })
	const stream = fs.createWriteStream(out)

	return new Promise((resolve, reject) => {
		archive
			.directory(source, false)
			.on('error', (err) => reject(err))
			.pipe(stream)

		stream.on('close', () => resolve())
		archive.finalize()
	})
}

const deleteDirectory = async (dirPath) => {
	const files = await readdir(dirPath)
	await Promise.all(
		files.map(async (file) => {
			await unlink(path.join(dirPath, file))
		})
	)
	await rmdir(dirPath)
}

export async function generateZip(
	imagePath,
	fontPath,
	fontSize,
	fieldsCoords,
	csvPath,
	primaryField
) {
	try {
		const zipPath = csvPath.substring(0, csvPath.length - 4) + Date.now()

		const results = await readCsv(csvPath)
		console.log('CSV Read successfull')

		try {
			await access(zipPath)
		} catch (err) {
			console.log(`Zip folder not existing creating now: ${err}`)
			await mkdir(zipPath)
		}
		console.log(`Primary field: ${primaryField}`)

		const imagePromises = results.map(async (row) => {
			console.log(`Row: ${row}`)
			const img = generateImage(
				imagePath,
				fontPath,
				fontSize,
				fieldsCoords,
				row
			)
			const absolutePath = path.resolve(
				`${zipPath}/${row[primaryField]}.jpg`
			)
			console.log(absolutePath)
			return writeImage(img, absolutePath)
		})

		await Promise.all(imagePromises)
		console.log('All images successfully created')

		const zipFile = `${zipPath}.zip`
		await zipDirectory(zipPath, zipFile)
		console.log('Directory successfully zipped: ', zipFile)

		await deleteDirectory(zipPath)
		console.log('Directory deleted successfully')

		return zipFile
	} catch (err) {
		console.log('Error in generating files: ', err)
	}
}

// generateZip(
// 	'images/cert.jpg',
// 	'Magnolia Script.otf',
// 	60,
// 	{
// 		Name: [880, 640],
// 		Department: [360, 720],
// 		'Register Number': [1400, 720],
// 	},
// 	'detailsMedhanvesh.csv',
// 	'Register Number'
// )
