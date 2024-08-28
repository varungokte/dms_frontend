import { FieldValues } from '@/types/DataTypes';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TextField } from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

function TableKeyValues(props:{prefillValues:FieldValues, setPrefillValues:Function}){

  const addNewValue = (index:number) => {
    const key = Object.keys(props.prefillValues)[index];
    props.setPrefillValues((curr:FieldValues)=>{
      curr[key].push("");
      return {...curr};
    });
  };

  const removeValue = (index:number) => {
    const key = Object.keys(props.prefillValues)[index];
    props.setPrefillValues((curr:FieldValues)=>{
      curr[key].pop();
      return {...curr};
    });
  };

  if (Object.keys(props.prefillValues).length==0)
    return <></>;

  return (
    <Table className="bg-white rounded-xl">
      <TableHead>
        <TableRow>
          <TableCell>Category</TableCell>
          <TableCell>Values</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.keys(props.prefillValues).map((category,index)=>{
          return (
            <TableRow key={index}>
              <TableCell>{category}</TableCell>
              <TableCell>
                <div className="grid grid-cols-5">
                    {props.prefillValues[category].map((val:string,itemIndex:number)=>{
                      return(
                        <div key={itemIndex} className="my-2 mr-2">
                          {/* <p className="bg-green-700 text-white">{val}</p> */}
                          {/* <input key={itemIndex} className={`text-xl p-1 rounded-if bg-gray-100 mx-2`} size={30} value={val} onChange={()=>{}} /> */}
                          <TextField 
                            size="small" color="secondary" 
                            value={val}
                            onChange={(e)=>{
                              props.setPrefillValues((curr:FieldValues)=>{
                                const key = Object.keys(props.prefillValues)[index];
                                curr[key][itemIndex] = e.target.value;
                                return {...curr}; 
                              })
                            }} 
                          />
                        </div>
                      )
                    })}
                
                  <span className="my-4">
                    {props.prefillValues[category].length>1?<button onClick={()=>removeValue(index)}><RemoveCircleIcon fontSize="medium" color="error" className="mx-2" /></button>:<></>}
                    <button className="mx-2" onClick={()=>addNewValue(index)}><AddCircleIcon fontSize="medium" color="secondary" /></button>
                  </span>
                </div>
              </TableCell>
              </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
//<MultiTextField index={1} fieldData={fieldData as FormFieldAttributes} prefillValues={prefillValues} setPrefillValues={setPrefillValues} disabled={false}  />
export default TableKeyValues;