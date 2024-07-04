import { toast } from "react-toastify";
import { useState } from "react";
import { Button } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function Form() {
  const [fieldsCount, setFieldsCount] = useState(0);
  const [fieldsInfo, setFieldsInfo] = useState({});
  const [fieldIndex, setFieldIndex] = useState(null);
  const [cert, setCert] = useState({
    file: null,
    url: ''
  })
  const [csvFile, setCsvFile] = useState({
    file: null,
    url: ''
  })

  const handleSelect = (e) => {
    setFieldIndex(e.target.value);
  };

  const handleSetField = (e) => {
    setFieldsInfo({
      ...fieldsInfo,
      [fieldIndex]: e.target.value,
    });
  };

  const handleCertUpload = (e) =>{
    if (
        e.target.files[0] &&
        ['image/png', 'image/jpg', 'image/jpeg'].includes(e.target.files[0].type)
    ){
        setCert({
            file: e.target.files[0],
            url: URL.createObjectURL(e.target.files[0]),
        })
    }
    else{
        toast.error("Unsupported file-type!")
    }
  }

  const handleCSVUpload = (e) =>{
    if (
        e.target.files[0] && e.target.files[0].type === 'csv'
    ){
        setCsvFile({
            file: e.target.files[0],
            url: URL.createObjectURL(e.target.files[0])
        })
    }
    else{
        toast.error("Unsupported file-type!")
    }
  }


  return (
    <div className="flex flex-col gap-10 text-primary justify-center">
      <div className="flex items-center gap-5">
        <p>Number of Fields:</p>
        <input
          className="text-black"
          type="text"
          name="fieldsCount"
          onChange={(e) => setFieldsCount(e.target.value)}
        />
      </div>
      <div className="flex gap-5 items-center">
        Upload Ceritificate Image
        <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} >
            Upload file
            <input type="file" name="cert" hidden onChange={handleCertUpload} />
        </Button>
      </div>
      <div className="flex gap-5 items-center">
        Upload CSV
        <Button variant="contained" component="label" startIcon={<CloudUploadIcon />}>
            Upload CSV
            <input type="file" name="csvFile" onChange={handleCSVUpload} hidden/>
        </Button>
      </div>
      <div className="flex flex-col gap-5 items-center">
        <div className="flex gap-5 items-center">
          <p>Enter field names</p>
          <select name="fields" className="text-black" onChange={handleSelect}>
            <option value={null}>Select a Field</option>
            {Array.from({ length: fieldsCount }).map((_, i) => (
              <option key={i} value={`field${i + 1}`} className="text-black">
                Field {i + 1}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          name="fieldName"
          onChange={handleSetField}
          className="text-black"
        />
      </div>
    </div>
  );
}

export default Form;
