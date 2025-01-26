import React from 'react'
import CancelIcon from '@mui/icons-material/Cancel'

function Sample({ sample, setSampleMode }) {
  console.log(sample)
  return (
    <div className="absolute top-16 left-0 right-0 m-auto z-10 w-max h-max bg-primary p-2 rounded-md">
      <img src={sample.url} className="w-[40vw] h-[60vh]" />
      <CancelIcon
        className="absolute top-5 left-[90%] cursor-pointer"
        color="primary"
        onClick={(e) => {
          e.preventDefault()
          setSampleMode((prev) => !prev)
        }}
      />
    </div>
  )
}

export default Sample
