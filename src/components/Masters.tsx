import {  useEffect, useState } from 'react';
import { FieldValues, MastersValues as MV } from '@/types/DataTypes';

import SubmitButton from './BasicButtons/SubmitButton';
import TableKeyValues from './BasicTables/TableKeyValues';
import { defaultMastersValues, mastersKeyToLabels } from '@/Constants';
import { addToMasters } from '@/apiFunctions/masterAPIs';

type MasterValues = {[key:string]: {V:string, S?:string}[]}

function Masters(props:{label:string, masterLists: FieldValues, id?:string, callMasterLists:Function}){
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const [mastersData, setMastersData] = useState<MasterValues>({});

  const submitMasters = async () => {
    console.log("comparing", props.masterLists, mastersData);
    const res = await addToMasters(props.id?{...mastersData, _id:props.id}:mastersData);
    console.log("res",res); 
  }

  useEffect(()=>{
    if (props.masterLists && Object.keys(props.masterLists).length>0)
      setMastersData(props.masterLists);
    else{
      const obj:FieldValues={};
      for (let i=0; i<Object.keys(defaultMastersValues).length; i++){
        const [key,_] = Object.entries(defaultMastersValues)[i];
        for (let j=0; j<Object.keys(mastersKeyToLabels).length; j++){
          if (mastersKeyToLabels[Object.keys(mastersKeyToLabels)[i]]==key){
            obj[Object.keys(mastersKeyToLabels)[i]] = defaultMastersValues[key as keyof MV].map(v=>({V:v})).slice(1);
          }
        }
      }
      setMastersData(obj);
    }
  },[]);

  if (!mastersData)
    return <></>;

  return(
    <div>
      <p className="text-3xl font-bold m-7">{props.label}</p>
      <div className="float-right mx-7 my-5"><SubmitButton submitFunction={submitMasters} submitButtonText="Save Changes" /></div>
      <div className="mx-7"><TableKeyValues prefillValues={mastersData} setPrefillValues={setMastersData} /></div>
      <div className="float-right mx-7 my-5"><SubmitButton submitFunction={submitMasters} submitButtonText="Save Changes" /></div>
      <br />
    </div>
  )
}

export default Masters;