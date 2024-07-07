import { Button } from '@mui/material'
import React from 'react'

function ImageCoord({ image, coords, setCoords, setPickMode }) {
    const handleClick = (e) => {
        e.preventDefault()
        let img = document.getElementById('imageCanvas')
        var rect = e.target.getBoundingClientRect()
        var x = e.clientX - rect.left
        var y = e.clientY - rect.top
        let scaleX = img.naturalWidth / rect.width
        let scaleY = img.naturalHeight / rect.height
        x = Math.round(x * scaleX)
        y = Math.round(y * scaleY)
        setCoords({
            xcoord: x,
            ycoord: y,
        })
    }

    const handleReset = (e) => {
        e.preventDefault();
        setCoords({
            xcoord: 0,
            ycoord: 0
        })
    }

    return (
        <div className="absolute top-auto -left-[50%] m-auto z-10 w-max h-max bg-primary p-2 rounded-md">
            <img
                src={image.url}
                alt=""
                className="w-[40vw] h-[60vh]"
                onClick={handleClick}
                id="imageCanvas"
            />
            <hr className="text-background bg-background h-1 my-2" />
            <div className="flex gap-2 justify-center items-center text-black">
                <p className="flex gap-4">
                    X-Coordinate: &nbsp;
                    {coords['xcoord']}
                </p>
                <p className="flex gap-4">
                    Y-Coordinate: &nbsp;
                    {coords['ycoord']}
                </p>
                <Button variant="contained" color="success" onClick={(e)=>setPickMode(prev => !prev)}>
                    Set
                </Button>
                <Button variant="contained" color="error" onClick={handleReset}>
                    Reset
                </Button>
                <Button variant='contained' onClick={(e)=>setPickMode(prev => !prev)}>
                    Cancel
                </Button>
            </div>
        </div>
    )
}

export default ImageCoord
