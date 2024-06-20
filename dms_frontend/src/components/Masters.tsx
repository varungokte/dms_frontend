import { useEffect, useState } from 'react';
import useGlobalContext from "./../../GlobalContext";
import { FieldValues, FormFieldDetails } from 'DataTypes';

import { Table, TableBody, TableCell, TableRow, } from "@/components/ui/table";
import FormDialog from './FormComponents/FormDialog';
import LoadingMessage from "./BasicComponents/LoadingMessage";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";
import { HeaderRows } from './BasicComponents/Table';

import AddIcon from '@mui/icons-material/Add';
import { CreateButtonStyling } from './BasicComponents/PurpleButtonStyling';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';

function Masters(){
  const [mastersData, setMastersData] = useState<{[key:string]:string[]}>();
  const [idList, setIdList] = useState<string[]>();

  const [fieldList] = useState<FormFieldDetails>([
    { category: "single", id:"N", name: "Category Name", type:"text", required:true },
    { category: "single", id:"V", name: "Values", type:"multitext", required:true},
  ]);

  const [selected, setSelected] = useState(0);
  const [added,setAdded] = useState(true);
  const [newValues, setNewValues] = useState<{N:string, V:string[]}>();

  const [informationMessages] =  useState({
    "duplicate":<p className="text-red-700 text-base m-2">All values must be unique</p>,
    "empty":<p className="text-red-800 m-2">Please fill the empty field(s) or remove them</p>,
    "success":<p>Success</p>,
    "error":<p>Something went wrong</p>,
    "ok":<></>,
  })
  const [information, setInformation] =useState<"duplicate"|"empty"|"ok"|"success"|"error">("ok");

  const {addToMasters, getMastersList} = useGlobalContext();

  useEffect(()=>{
    if (added){
      getMastersList().then(res=>{
        console.log("RESPONSE",res)
        if (res.status==200){
          const obj:any={};
          const idArr:string[]=[];
          res.obj.map((cat:any)=>{obj[cat.N]=cat.V; idArr.push(cat._id);});
          setMastersData(obj);
          setIdList(idArr);
          setAdded(false);
        }
        else
          setMastersData({});
      }).catch(()=>{
        setMastersData({})
      })
  }
  },[added]);

  const changeSection = (index:number) => {
    setSelected(index);
  }

  useEffect(()=>{
    if (!mastersData)
      return;
    const key = Object.keys(mastersData)[selected];
    const value = mastersData[key];
    setNewValues({N:key, V:value});
  },[selected,mastersData])
  
  const createMaster = async (userValues:FieldValues) =>{
    const res = await addToMasters(userValues);
    console.log("SUBMIT DATA",userValues);
    if (res==200)
      setAdded(true);
    return res;
  }

  const editMaster = async () => {
    if (newValues && newValues["V"].includes("")){
      setInformation("empty")
      return;
    } 
    if (!newValues || !idList || information=="duplicate")
      return;
    
    const userValues = {N:newValues.N, V:newValues.V, _id:idList[selected]}

    console.log("userValues",userValues)
    
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
      <p className="text-3xl font-bold m-7">Masters</p>
    
      <div className="flex flex-row">
        <div className="flex-auto"></div>
        <FormDialog key={-1} index={-1} type="mast"
          triggerText={<div className="flex flex-row"><AddIcon/><span className="m-auto"> Add</span></div>} triggerClassName={`${CreateButtonStyling} `} formSize="medium"
          formTitle="Add To Masters" formSubmit={createMaster} submitButton="Add" 
          form={fieldList} currentFields={{}}
        />
      </div>
      {mastersData
        ?Object.keys(mastersData).length!=0
          ?<div className="flex flex-row relative m-10">
            <div className="mr-9 w-[25%]">
              <Table className="rounded-2xl bg-white">
                <HeaderRows headingRows={["Category"]} headingClassNames={["text-2xl"]} />
                <TableBody className="border-none">
                  {Object.keys(mastersData).map((category, index)=>{
                    return (
                      <TableRow key={index} className="border-none">
                        <TableCell className={`text-xl tableCell ${selected===index?"text-blue-600 bg-slate-200":""}`} onClick={()=>{changeSection(index)}}>
                          {category}
                        </TableCell>
                      </TableRow>
                  )})}
                </TableBody>
              </Table>
            </div>

            <div className="mx-20"></div>
    
            <div className="mr-28 w-[50%]">
              <Table className="rounded-2xl bg-white">
                <HeaderRows headingRows={[Object.keys(mastersData)[selected]]} headingClassNames={["text-2xl"]} />
                <TableBody>
                  {newValues?.V.map((data:any,index:number)=>{
                    if (data==="-")
                      return <></>
                    return (
                      <TableRow key={index} className="border-none">
                        <TableCell>
                          <div className="flex flex-row">
                            <input className={`text-xl p-1 rounded-if bg-gray-100 w-full`} value={data} onChange={(e)=>editValue(e.target.value,index)} />
                            <button className='p-1' onClick={()=>removeValue(index)}>
                              <RemoveCircleIcon fontSize="medium" className="mx-2" sx={{color:"red"}} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                  <TableRow>
                    <TableCell>
                      <button onClick={createNewEntry}><AddCircleIcon sx={{color:"rgba(80, 65, 188, 1)"}} /></button>
                      {informationMessages[information]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <button className={`w-full h-[40px] rounded-if text-white text-lg bg-custom-1 hover:bg-custom-1`} onClick={editMaster}>
                        Save Changes
                      </button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
          :<EmptyPageMessage sectionName="masters" emotion/>
        :<LoadingMessage sectionName="data" />
      }
    </div>
  )
}

export default Masters;