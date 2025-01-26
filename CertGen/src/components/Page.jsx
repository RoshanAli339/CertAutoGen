import { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Sample from './Sample/Sample.jsx'
import Loader from './Loader.jsx'
import {
  faTrash,
  faCircleCheck,
  faArrowsToCircle,
  faPlus,
  faCropSimple,
  faCertificate,
  faCircleDown,
} from '@fortawesome/free-solid-svg-icons'
import ImageCoord from './ImageCoord/ImageCoord.jsx'
import axios from 'axios'
import { certificate } from 'fontawesome'

const Page = () => {
  const formRef = useRef(null)
  const [properties, setProperties] = useState([{ name: '', x: 0, y: 0 }])
  const [pickMode, setPickMode] = useState(false)
  const [fontSize, setFontSize] = useState(0)
  const [sampleMode, setSampleMode] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [sampleFile, setSampleFile] = useState({
    file: null,
    url: '',
  })
  const [fontFile, setFontFile] = useState({
    file: null,
    url: '',
  })
  const [template, setTemplate] = useState({
    file: null,
    url: '',
  })
  const [csvFile, setCsvFile] = useState({
    file: null,
    url: '',
  })
  const [zipFile, setZipFile] = useState({
    file: null,
    url: '',
  })
  const [editIndex, setEditIndex] = useState(0)
  const [primary, setPrimary] = useState(0)

  const updateProperty = (index, key, value) => {
    setProperties((prevProperties) =>
      prevProperties.map((prop, i) =>
        i === index ? { ...prop, [key]: value } : prop
      )
    )
    setZipFile({
      file: null,
      url: '',
    })
  }

  const handleFontFile = (e) => {
    e.preventDefault()
    if (
      e.target.files[0] &&
      [
        'font/ttf',
        'font/otf',
        'font/woff',
        'font/woff2',
        'application/vnd.ms-fontobject',
        'application/vnd.oasis/formula-template',
      ].includes(e.target.files[0].type)
    ) {
      setFontFile({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      })
      setZipFile({
        file: null,
        url: '',
      })
    } else {
      toast.error('Unsupported file-type!')
    }
  }

  const handleTemplate = (e) => {
    e.preventDefault()
    if (e.target.files.length !== 1) {
      toast.error('Please select a file')
      return
    }
    if (
      e.target.files[0] &&
      ['image/png', 'image/jpg', 'image/jpeg'].includes(e.target.files[0].type)
    ) {
      setTemplate({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      })
      setZipFile({
        file: null,
        url: '',
      })
    } else {
      toast.error('Unsupported file-type!')
    }
  }

  const handleCsvFile = (e) => {
    e.preventDefault()
    if (e.target.files[0] && e.target.files[0].type === 'text/csv') {
      setCsvFile({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      })
      setZipFile({
        file: null,
        url: '',
      })
    } else {
      toast.error('Unsupported file-tpye!')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    formData.append('fieldsLength', properties.length)
    formData.append('primary', properties[primary].name)
    console.log(formData)
    try {
      setWaiting((prev) => !prev)
      const res = await axios.post(
        `${import.meta.env.VITE_BACKENDURL}/api/zip`,
        formData,
        {
          responseType: 'blob',
        }
      )
      setZipFile({
        file: res.data,
        url: URL.createObjectURL(res.data),
      })
    } catch (error) {
      toast.error(error)
      console.log(error)
    }
    setWaiting((prev) => !prev)
  }

  const handleDownload = (e) => {
    e.preventDefault()
    const link = document.createElement('a')
    link.href = zipFile.url
    link.download = `${csvFile.file.name.substring(0, csvFile.file.name.length - 4)}${Date.now()}.zip`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSample = async (e) => {
    e.preventDefault()
    const formData = new FormData(formRef.current)
    formData.append('fieldsLength', properties.length)
    console.log(formData)
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKENDURL}/api/sample2`,
        formData,
        {
          responseType: 'blob',
        }
      )
      setSampleFile({
        file: res.data,
        url: URL.createObjectURL(res.data),
      })
      console.log(res.data)
      setSampleMode((prev) => !prev)
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  return (
    <div className="m-5 w-[75%] relative">
      {pickMode && (
        <ImageCoord
          image={template}
          properties={properties}
          updateProperty={updateProperty}
          editIndex={editIndex}
          setPickMode={setPickMode}
        />
      )}
      {sampleMode && (
        <Sample sample={sampleFile} setSampleMode={setSampleMode} />
      )}
      {waiting && <Loader />}
      <h1 className="text-3xl font-bold">Certificate Generator</h1>

      <div className="m-5 border-gray-300 rounded-md border p-6">
        <h1 className="text-2xl font-bold">Certificate Configuration</h1>
        <br />

        <form ref={formRef} onSubmit={handleSubmit}>
          <label htmlFor="template">Certifiacte Template</label>
          <p
            className="border border-gray-300 p-2 rounded-md mt-2 mb-4 hover:bg-gray-100 hover:ease-out"
            onClick={() => document.getElementById('template').click()}
          >
            <input
              id="template"
              type="file"
              name="certificate"
              className="file:border-none file:bg-transparent"
              accept="image/png,image/jpg,image/jpeg"
              onChange={handleTemplate}
            />
          </p>

          <label htmlFor="csvFile">CSV File</label>
          <p
            className="border border-gray-300 p-2 rounded-md mt-2 mb-4 hover:bg-gray-100 hover:ease-out"
            onClick={() => document.getElementById('csvFile').click()}
          >
            <input
              id="csvFile"
              type="file"
              name="csv"
              className="file:border-none file:bg-transparent"
              accept=".csv"
              onChange={handleCsvFile}
            />
          </p>

          <label htmlFor="fontFile">Font File</label>
          <p
            className="border border-gray-300 rounded-md p-2 mt-2 mb-4 hover:bg-gray-100 hover:ease-out"
            onClick={() => document.getElementById('fontFile').click()}
          >
            <input
              type="file"
              name="font"
              id="fontFile"
              className="file:border-none file:bg-transparent"
              onChange={handleFontFile}
              accept="font/ttf,font/otf,font/woff,font/woff2,application/vnd.ms-fontobject,application/vnd.oasis/formula-template"
            />
          </p>

          <label htmlFor="fontSize">Font Size</label>
          <p className="border border-gray-300 rounded-md p-2 mt-2 mb-4 w-[16%]">
            <input
              type="number"
              name="fontSize"
              placeholder="Font Size"
              className="focus:outline-none "
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            />
          </p>

          <p>Certificate Properties</p>
          <div className="border border-gray-300 rounded-md mt-2 mb-2 p-4 shadow-md">
            {properties.map((prop, index) => (
              <div key={index} className="flex flex-col space-y-6 mb-4">
                <div className="flex gap-2 items-end">
                  <div className="flex flex-col flex-grow">
                    <label
                      htmlFor={`propertyName-${index}`}
                      className="mb-1 text-sm font-medium"
                    >
                      Property Name
                    </label>
                    <input
                      name={`propertyName-${index}`}
                      type="text"
                      placeholder="CSV Column Name"
                      value={prop.name}
                      className="p-2 border border-gray-300 rounded-md"
                      onChange={(e) => {
                        e.preventDefault()
                        updateProperty(index, 'name', e.target.value)
                      }}
                    />
                  </div>

                  <div className="flex flex-col w-1/4">
                    <label
                      htmlFor={`xcoord-${index}`}
                      className="mb-1 text-sm font-medium"
                    >
                      X - Coordinate
                    </label>
                    <input
                      placeholder="X-Coordinate"
                      name={`xcoord-${index}`}
                      type="number"
                      value={prop.x}
                      className="p-2 border border-gray-300 rounded-md"
                      onChange={(e) =>
                        updateProperty(index, 'x', e.target.value)
                      }
                    />
                  </div>

                  <div className="flex flex-col w-1/4">
                    <label
                      htmlFor={`ycoord-${index}`}
                      className="mb-1 text-sm font-medium"
                    >
                      Y - Coordinate
                    </label>
                    <input
                      name={`ycoord-${index}`}
                      type="number"
                      placeholder="Y-Coordinate"
                      value={prop.y}
                      className="p-2 border border-gray-300 rounded-md"
                      onChange={(e) =>
                        updateProperty(index, 'y', e.target.value)
                      }
                    />
                  </div>

                  {properties.length > 1 && (
                    <div className="flex justify-center">
                      <button
                        className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                        onClick={(e) => {
                          e.preventDefault()
                          const newProperties = properties.filter(
                            (_, i) => i !== index
                          )
                          setProperties(newProperties)
                          setZipFile({
                            file: null,
                            url: '',
                          })
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  )}

                  <div className="flex justify-center">
                    <button
                      className={
                        'px-4 py-2 rounded-md ' +
                        (primary === index
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-white text-green-500 hover:bg-gray-100')
                      }
                      onClick={(e) => {
                        e.preventDefault()
                        setPrimary(index)
                      }}
                    >
                      <FontAwesomeIcon icon={faCircleCheck} />
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                      onClick={(e) => {
                        e.preventDefault()
                        setEditIndex(index)
                        setPickMode((prev) => !prev)
                      }}
                    >
                      <FontAwesomeIcon icon={faArrowsToCircle} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-sm">
            <button
              className="border border-gray-300 rounded-md p-2 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault()
                setProperties([...properties, { name: '', x: 0, y: 0 }])
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
              &nbsp;&nbsp;Add Property
            </button>
          </div>
          <div className="text-sm mt-[3rem] mb-4 flex justify-around items-center w-[40%]">
            <button
              className="border border-gray-300 rounded-md p-2 hover:bg-slate-600 bg-slate-500 text-stone-100"
              type="button"
              onClick={handleSample}
            >
              <FontAwesomeIcon icon={faCropSimple} />
              &nbsp;&nbsp;Try Sample
            </button>
            <button
              className="border border-gray-300 rounded-md p-2 hover:bg-zinc-900 bg-zinc-800 text-white"
              type="submit"
            >
              <FontAwesomeIcon icon={faCertificate} />
              &nbsp;&nbsp; Generate Certificates
            </button>
            {zipFile.file && (
              <button
                className="border border-gray-300 rounded-md p-2 hover:bg-zinc-900 bg-zinc-800 text-white"
                type="submit"
                onClick={handleDownload}
              >
                <FontAwesomeIcon icon={faCircleDown} />
                &nbsp;&nbsp; Download Zip
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
export default Page
