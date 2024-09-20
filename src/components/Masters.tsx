import { useContext, useEffect, useState } from 'react';
import { FieldValues } from '@/types/DataTypes';
import { FieldAttributesList } from "@/types/FormAttributes";
import { adminEnteredMasters } from '@/Constants';
import { PermissionContext } from "@/Contexts";
import { addToMasters } from '@/apiFunctions/masterAPIs';

import DataTableHead from './BasicTables/DataTableHead';
import { Table, TableBody, TableCell, TableRow, } from "@/components/ui/table";
import FormDialog from './FormComponents/FormDialog';
import LoadingMessage from "./BasicMessages/LoadingMessage";
import EmptyPageMessage from "./BasicMessages/EmptyPageMessage";
import TableSelect from './BasicTables/TableSelect';
import AddButton from './BasicButtons/AddButton';

import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function Masters(props:{label:string, masterLists: FieldValues, idList:FieldValues, callMasterLists:Function}){
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);
  
  const [fieldList, setFieldList] = useState<FieldAttributesList>([
    { category: "single", id:"N", name: "Category Name", type:"select", options:Object.keys(adminEnteredMasters), required:true },
    { category: "single", id:"V", name: "Values", type:"multitext", required:true},
  ]);

  const [addOpen, setAddOpen] = useState([false]);
  const [selected, setSelected] = useState(0);
  const [added,setAdded] = useState(true);
  const [newValues, setNewValues] = useState<{N:string, V:string[]}>();

  const {userPermissions} = useContext(PermissionContext);

  const [informationMessages] =  useState({
    "duplicate":<p className="text-red-700 text-base m-2">All values must be unique</p>,
    "empty":<p className="text-red-800 m-2">Please fill the empty field(s) or remove them</p>,
    "success":<p>Success</p>,
    "error":<p>Something went wrong</p>,
    "ok":<></>,
  })
  const [information, setInformation] =useState<"duplicate"|"empty"|"ok"|"success"|"error">("ok");

  useEffect(()=>{
    console.log("props.mastersList",props.masterLists)
    if (props.masterLists){
      setFieldList(curr=>{
        if (curr[0].category=="single")
          curr[0].options = Object.keys(adminEnteredMasters).filter(option=>{console.log("option",option,adminEnteredMasters[option],Object.keys(props.masterLists).includes(adminEnteredMasters[option])); return !Object.keys(props.masterLists).includes(adminEnteredMasters[option])})
        console.log("curr",[...curr])
      return [...curr];
      })
    }
  },[props.masterLists]);


  useEffect(()=>{
    if (added && props){
      props.callMasterLists(true);
      setAdded(false);
    }
  },[added]);

  useEffect(()=>{
    if (!props.masterLists)
      return;
    const key = Object.keys(props.masterLists)[selected];
    const value = props.masterLists[key];
    setNewValues({N:key, V:value});
  },[selected,props.masterLists]);

  /* const cleanUpInput = (str:string):string[] =>{
    let val=str.trim();

    val=val.replaceAll("\n","");
    val=val.replaceAll("\"","");
    val=val.replaceAll(", ",",");
    val=val.replaceAll(" ,",",");
    
    if (val.charAt(val.length-1)==",")
      val=val.slice(0,val.length-1);
    const arr = val.split(",");
    return [...(new Set(arr))];
  } */

  const createMaster = async (userValues:FieldValues) =>{
    //userValues["V"]= cleanUpInput(userValues["V"]);
    console.log("uservalues", userValues);
    const res = await addToMasters(userValues);
    if (res==200)
      setAdded(true);
    return res;
  }

  const editMaster = async () => {
    if (newValues && newValues["V"].includes("")){
      setInformation("empty")
      return;
    } 
    if (!newValues || !props.idList || information=="duplicate")
      return;
    
    const userValues = {N:newValues.N, V:newValues.V, _id:props.idList[newValues.N]}

    //console.log("userValues",userValues)
    
    const res = await addToMasters(userValues);

    if (res==200){
      setAdded(true);
      setInformation("success")
    }
    else
      setInformation("error")
  }

  const editValue = (value:string,index:number) => {
    if (!newValues)
      return;

    if (newValues.V.includes(value))
      setInformation("duplicate")
    else
      setInformation("ok");

      setNewValues(curr=>{
        if (curr){
          curr.V[index]=value;
          return {...curr};
        }
      })
  }

  const createNewEntry = () => {
    setNewValues(curr=>{
      if (curr){
        curr.V.push("");
        return {...curr};
      }
    })
  }

  const removeValue = (index:number) =>{
    setNewValues(curr=>{
      if (curr){
        curr.V.splice(index,1);
        return {...curr};
      }
    })
  }
  
  return(
    <div>
      <p className="text-3xl font-bold m-7">{props.label}</p>
    
      <div className="flex flex-row">
        <div className="flex-auto"></div>
        {userPermissions && userPermissions["masters"] && userPermissions["masters"].includes("add")
          ?<div>
            <AddButton sectionName="" onClick={()=>setAddOpen([true])} />
            {addOpen[0]
              ?<FormDialog key={0} index={0} type="mast"
                formOpen={addOpen[0]} setFormOpen={setAddOpen} formSize="md"
                formTitle="Add To Masters" formSubmit={createMaster} submitButton="Add" 
                form={fieldList} currentFields={{}}
              />
              :<></>
            }
          </div>
          :<></>
        }
      </div>
      {props.masterLists
        ?Object.keys(props.masterLists).length!=0
          ?<div className="flex flex-row relative m-10">
            <TableSelect tableHeading="Category" tableValues={Object.keys(props.masterLists)} selected={selected} setSelected={setSelected} className={"w-[30%]"} textSize="large" />

            <div className="mx-20"></div>
            {newValues && newValues["V"]
              ?<div className="mr-28 w-[50%]">
                <Table className="rounded-2xl bg-white">
                  <DataTableHead headingRows={[Object.keys(props.masterLists)[selected]]} headingClassNames={["text-2xl"]} />
                  <TableBody>
                    {newValues["V"].map((data:any,index:number)=>{
                      if (data==="-")
                        return ""
                      return (
                        <TableRow key={index} className="border-none">
                          <TableCell>
                            <div className="flex flex-row">
                              <input disabled={!userPermissions["masters"].includes("edit")} className={`text-xl p-1 rounded-if bg-gray-100 w-full`} value={data} onChange={(e)=>editValue(e.target.value,index)} />

                              {userPermissions["masters"].includes("edit")
                                ?<button className='p-1' onClick={()=>removeValue(index)}>
                                  <RemoveCircleIcon fontSize="medium" className="mx-2" sx={{color:"red"}} />
                                </button>
                                :<></>
                              }
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    <TableRow>
                      <TableCell>
                        {userPermissions["masters"].includes("edit")
                          ?<button onClick={createNewEntry}><AddCircleIcon sx={{color:"rgba(80, 65, 188, 1)"}} /></button>
                          :<></>
                        }
                        {informationMessages[information]}
                      </TableCell>
                    </TableRow>
                    {userPermissions["masters"].includes("edit")
                      ?<TableRow>
                        <TableCell>
                          <button className={`w-full h-[40px] rounded-if text-white text-lg bg-custom-1 hover:bg-custom-1`} onClick={editMaster}>
                            Save Changes
                          </button>
                        </TableCell>
                      </TableRow>
                      :<></>
                    }
                  </TableBody>
                </Table>
             </div>
              :<></>
            }
          </div>
          :<EmptyPageMessage sectionName="masters" emotion/>
        :<LoadingMessage sectionName="data" />
      }
    </div>
  )
}

export default Masters;