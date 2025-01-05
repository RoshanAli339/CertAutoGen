import { useState } from 'react'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faTrash,
  faCircleCheck,
  faArrowsToCircle,
  faPlus,
} from '@fortawesome/free-solid-svg-icons'
import ImageCoord from './ImageCoord/ImageCoord.jsx'

const Page = () => {
  const [properties, setProperties] = useState([{ name: '', x: 0, y: 0 }])
  const [pickMode, setPickMode] = useState(false)
  const [template, setTemplate] = useState({
    file: null,
    url: '',
  })
  const [csvFile, setCsvFile] = useState({
    file: null,
    url: '',
  })
  const [editIndex, setEditIndex] = useState(0)
  const [primary, setPrimary] = useState(0)

  const updateProperty = (index, key, value) => {
    setProperties((prevProperties) => {
      prevProperties.map((prop, i) => {
        i === index ? { ...prop, [key]: value } : prop
      })
    })
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
    } else {
      toast.error('Unsupported file-tpye!')
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
      <h1 className="text-3xl font-bold">Certificate Generator</h1>

      <div className="m-5 border-gray-300 rounded-md border p-6">
        <h1 className="text-2xl font-bold">Certificate Configuration</h1>
        <br />
        <form>
          <label htmlFor="template">Certifiacte Template</label>
          <p className="border border-gray-300 p-2 rounded-md mt-2 mb-4 hover:bg-gray-100 hover:ease-out">
            <input
              type="file"
              name="template"
              className="file:border-none file:bg-transparent"
              accept=".jpg,.png,.jpeg"
            />
          </p>

          <label htmlFor="csvFile">CSV File</label>
          <p className="border border-gray-300 p-2 rounded-md mt-2 mb-4 hover:bg-gray-100 hover:ease-out">
            <input
              type="file"
              name="csvFile"
              className="file:border-none file:bg-transparent"
              accept=".csv"
            />
          </p>

          <p>Certificate Properties</p>
          <div className="border border-gray-300 rounded-md m-2 p-4">
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
                      type="number"
                      placeholder="X-Coordinate"
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
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  )}

                  <div className="flex justify-center">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
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
              className="border border-black rounded-md p-2 hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault()
                setProperties([...properties, { name: '', x: 0, y: 0 }])
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
              &nbsp;&nbsp;Add Property
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Page
