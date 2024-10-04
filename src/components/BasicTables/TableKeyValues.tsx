import { useState, useEffect } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
//Simport Tooltip from '@mui/material/Tooltip';
import Button from "@mui/material/Button";

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SendIcon from '@mui/icons-material/Send';
import { mastersKeyToLabels } from '@/Constants';

function TableKeyValues(props:{prefillValues:{[key:string]: {V:string, S?:string}[]}, setPrefillValues:React.Dispatch<React.SetStateAction<{[key:string]: {V:string, S?:string}[]}>>}){
  //console.log("table key value props",props);
  if (!props.prefillValues)
    return<>ERROR! ERROR! CANNOT COMPUTE!</>;

  const [addNew, setAddNew] = useState<boolean[]>(new Array(Object.keys(props.prefillValues).length));
  const [newValues, setNewValues] = useState<string[]>(new Array(Object.keys(props.prefillValues).length));

  useEffect(()=>{
    setAddNew(new Array(Object.keys(props.prefillValues).length).fill(false));
    setNewValues(new Array(Object.keys(props.prefillValues).length).fill(""));
  },[props.prefillValues]);

  if (Object.keys(props.prefillValues).length==0)
    return <></>;
  
  return (
    <Table className="bg-white rounded-xl">
      <TableHead>
      {/*<TableRow>
          <TableCell>Category</TableCell>
          <TableCell>Values</TableCell>
        </TableRow> */}
      </TableHead>
      <TableBody>
        {Object.keys(props.prefillValues).map((category,index)=>{
          return (
            <TableRow key={index}>
              <TableCell>{mastersKeyToLabels[category]}</TableCell>
              <TableCell>
                <div className="flex flex-wrap">
                  {props.prefillValues[category].map((val,valIndex)=>{
                    const status = val.S;
                    return (
                      <div key={valIndex} className="m-2">
                        <Chip  variant={status=="inactive"?"filled":"outlined"}
                          label={<p className={status=="inactive"?"text-gray-500":""}>{val.V}</p>} 
                          onDelete={()=>props.setPrefillValues(curr=>{
                            if (!status||status=="active")
                              curr[category][valIndex].S = "inactive";
                            else
                              curr[category][valIndex].S = "active";
                            return {...curr};
                          })} 
                          deleteIcon={!status||status=="active"
                            ?<RemoveCircleIcon fontSize="medium" color="error" className="mx-2" />
                            :<AddCircleIcon fontSize="medium" color="error" className="mx-2" />
                          }
                        />
                      </div>
                    )
                  })}
                  {addNew&&addNew[index]
                    ?<div className="flex flex-row">
                      <TextField size="small" onChange={(e)=>setNewValues(curr=>{curr[index]=e.target.value; return [...curr]})}  />
                      <div>
                        <Button 
                          variant="outlined" 
                          color="secondary" 
                          size="large" 
                          onClick={()=>props.setPrefillValues(curr=>{
                            console.log("curr",curr,"category",category);
                            if (newValues[index]!="")
                              curr[category].push({V:newValues[index]});
                            return {...curr};
                          })}
                        >
                            <SendIcon />
                        </Button>
                      </div>
                    </div>
                    :<button className="my-3 mx-2" onClick={()=>setAddNew(curr=>{curr[index]=true; return[...curr]})}><AddCircleIcon fontSize="medium" color="secondary" />Add New</button>
                  }
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default TableKeyValues;