import { toast } from 'react-toastify'
import { useState, useEffect } from 'react'
import { Button } from '@mui/material'
import Input from '@mui/joy/Input'
import LoadingButton from '@mui/lab/LoadingButton'
import SaveIcon from '@mui/icons-material/Save'
import ImageIcon from '@mui/icons-material/Image'
import BackupTableIcon from '@mui/icons-material/BackupTable'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FontDownloadIcon from '@mui/icons-material/FontDownload'
import ImageCoord from '../ImageCoord/ImageCoord'
import Sample from '../Sample/Sample'
import axios from 'axios'

function Form() {
    const [pickMode, setPickMode] = useState(false)
    const [sampleMode, setSampleMode] = useState(false)
    const [fieldsInfo, setFieldsInfo] = useState({})
    const [fieldName, setFieldName] = useState('')
    const [fontSize, setFontSize] = useState(0)
    const [primary, setPrimary] = useState('')
    const [waiting, setWaiting] = useState(false)
    const [coords, setCoords] = useState({
        xcoord: 0,
        ycoord: 0,
    })
    const [cert, setCert] = useState({
        file: null,
        url: '',
    })
    const [csvFile, setCsvFile] = useState({
        file: null,
        url: '',
    })
    const [font, setFont] = useState({
        file: null,
        url: '',
    })
    const [sample, setSample] = useState({
        file: null,
        url: '',
    })
    const [zipFile, setZipFile] = useState({
        file: null,
        url: '',
    })

    const handleFieldSubmit = (e) => {
        e.preventDefault()
        if (fieldName === '' || (coords.xcoord == 0 && coords.ycoord == 0)) {
            toast.warn('Field Name or Valid Coordinates not set!')
            return
        }
        setFieldsInfo({
            ...fieldsInfo,
            [fieldName]: [coords.xcoord, coords.ycoord],
        })
        setCoords({
            xcoord: 0,
            ycoord: 0,
        })
        setFieldName('')
    }

    const handleCertUpload = (e) => {
        if (
            e.target.files[0] &&
            ['image/png', 'image/jpg', 'image/jpeg'].includes(
                e.target.files[0].type
            )
        ) {
            setCert({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            })
        } else {
            toast.error('Unsupported file-type!')
        }
    }

    const handleCSVUpload = (e) => {
        console.log(e.target.files)
        if (e.target.files[0] && e.target.files[0].type === 'text/csv') {
            setCsvFile({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            })
        } else {
            toast.error('Unsupported file-type!')
        }
    }

    const handleFontUpload = (e) => {
        e.preventDefault()
        console.log(e.target.files)
        if (
            e.target.files[0] &&
            [
                'font/ttf',
                'font/otf',
                'font/woff',
                'font/woff2',
                'application/vnd.ms-fontobject',
                'application/vnd.oasis.opendocument.formula-template',
            ].includes(e.target.files[0].type)
        ) {
            setFont({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            })
        } else {
            toast.error('Font file type not supported!')
            return
        }
    }

    const handleViewSample = async (e) => {
        e.preventDefault()
        if (!cert.url) {
            toast.error('Please upload a certificate')
            return
        }
        if (!font.url) {
            toast.error('Please upload a font file')
            return
        }
        if (fontSize === 0) {
            toast.error('Please enter a valid font size')
            return
        }
        if (Object.keys(fieldsInfo).length === 0) {
            toast.error('Please add atleast one field information')
            return
        }
        const formData = new FormData()
        formData.append('certificate', cert.file)
        formData.append('font', font.file)
        formData.append('size', fontSize)
        formData.append('fieldsCoords', JSON.stringify(fieldsInfo))

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKENDURL}/api/sample`,
                // 'http://localhost:5000/api/sample',
                formData,
                {
                    responseType: 'blob',
                }
            )

            setSample({
                file: response.data,
                url: URL.createObjectURL(response.data),
            })
        } catch (err) {
            console.log('Error uploading files: ', err)
        }

        setSampleMode((prev) => !prev)
    }

    const handleGenerateZip = async (e) => {
        e.preventDefault()
        if (!cert.url) {
            toast.error('Please upload a certificate')
            return
        }
        if (!font.url) {
            toast.error('Please upload a font file')
            return
        }
        if (!csvFile.url) {
            toast.error('Please upload a valid csv file')
            return
        }
        if (fontSize === 0) {
            toast.error('Please enter a valid font size')
            return
        }
        if (primary === '') {
            toast.error('Please provide a primary attribute')
            return
        }
        if (Object.keys(fieldsInfo).length === 0) {
            toast.error('Please add atleast one field information')
            return
        }
        setWaiting((prev) => !prev)
        const formData = new FormData()
        formData.append('certificate', cert.file)
        formData.append('font', font.file)
        formData.append('csv', csvFile.file)
        formData.append('size', fontSize)
        formData.append('fieldsCoords', JSON.stringify(fieldsInfo))
        formData.append('primary', primary)

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKENDURL}/api/zip`,
                // 'http://localhost:5000/api/zip',
                formData,
                {
                    responseType: 'blob',
                }
            )

            console.log('Received file: ', response.data)
            setZipFile({
                file: response.data,
                url: URL.createObjectURL(response.data),
            })
            setWaiting((prev) => !prev)
        } catch (err) {
            console.log('Error uploading files: ', err)
        }
    }

    const handleDownload = (e) => {
        e.preventDefault()
        const link = document.createElement('a')
        link.href = zipFile.url
        link.setAttribute('download', 'certificates.zip')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="flex flex-col gap-5 text-primary justify-center items-center relative">
            {pickMode && (
                <ImageCoord
                    image={cert}
                    coords={coords}
                    setCoords={setCoords}
                    setPickMode={setPickMode}
                />
            )}
            {sampleMode && (
                <Sample sample={sample} setSampleMode={setSampleMode} />
            )}
            <Button
                variant="contained"
                component="label"
                color={cert.url ? 'success' : 'primary'}
                startIcon={cert.url ? <CheckCircleIcon /> : <ImageIcon />}
            >
                Ceritificate Template
                <input
                    type="file"
                    name="cert"
                    hidden
                    onChange={handleCertUpload}
                />
            </Button>
            <Button
                variant="contained"
                component="label"
                startIcon={
                    csvFile.url ? <CheckCircleIcon /> : <BackupTableIcon />
                }
                color={csvFile.url ? 'success' : 'primary'}
            >
                CSV File
                <input
                    type="file"
                    name="csvFile"
                    onChange={handleCSVUpload}
                    hidden
                />
            </Button>
            <Button
                variant="contained"
                component="label"
                startIcon={
                    font.url ? <CheckCircleIcon /> : <FontDownloadIcon />
                }
                color={font.url ? 'success' : 'primary'}
            >
                Font File
                <input
                    type="file"
                    name="fontFile"
                    onChange={handleFontUpload}
                    hidden
                />
            </Button>
            <Input
                type="number"
                required
                variant="soft"
                placeholder="Font Size"
                onChange={(e) => setFontSize(e.target.value)}
                value={fontSize}
            />
            <Input
                required
                variant="soft"
                placeholder="Primary Field"
                onChange={(e) => setPrimary(e.target.value)}
            />
            <form
                className="flex flex-col gap-5 text-black"
                onSubmit={handleFieldSubmit}
            >
                <Input
                    variant="soft"
                    placeholder="Field Name"
                    name="fieldName"
                    required
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                />
                <Button
                    variant="contained"
                    color={
                        coords.xcoord === 0 && coords.ycoord === 0
                            ? 'primary'
                            : 'success'
                    }
                    onClick={(e) => setPickMode((prev) => !prev)}
                >
                    {coords.xcoord === 0 && coords.ycoord == 0 ? (
                        <>Pick Coordinate</>
                    ) : (
                        <>
                            <CheckCircleIcon />
                            &nbsp;Coordinates Set
                        </>
                    )}
                </Button>
                <Input
                    type="number"
                    name="xcoord"
                    required
                    variant="soft"
                    placeholder="X-Coordinates"
                    onChange={(e) =>
                        setCoords((prev) => {
                            return { ...prev, xcoord: e.target.value }
                        })
                    }
                    value={coords.xcoord}
                />
                <Input
                    type="number"
                    name="ycoord"
                    required
                    variant="soft"
                    placeholder="Y-Coordinate"
                    onChange={(e) =>
                        setCoords((prev) => {
                            return { ...prev, ycoord: e.target.value }
                        })
                    }
                    value={coords.ycoord}
                />
                <Button type="submit" variant="outlined">
                    Add Field
                </Button>
            </form>
            <div className="flex gap-5 items-center">
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleViewSample}
                >
                    Check Sample
                </Button>
                {zipFile.url || waiting ? (
                    <LoadingButton
                        loading={waiting}
                        variant="contained"
                        loadingPosition="start"
                        startIcon={<SaveIcon />}
                        onClick={handleDownload}
                    >
                        <p>Save</p>
                    </LoadingButton>
                ) : (
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleGenerateZip}
                    >
                        Generate Certificates
                    </Button>
                )}
            </div>
        </div>
    )
}

export default Form
