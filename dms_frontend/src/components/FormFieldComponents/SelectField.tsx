//import { useEffect } from "react";
import { DocumentSectionTypes, FormFieldAttributes } from "DataTypes";
import FieldLabel from "./FieldLabel";

function SelectField (props:{index:number|string,fieldData:FormFieldAttributes, prefillValues:any, setPrefillValues:Function, repeatFields?:boolean, formIndex?:number, sectionType?:DocumentSectionTypes, setFileType?:Function, setCovType?:Function, setOldZone?:Function, disabled:boolean}){
  //useEffect(()=>console.log(props),[props]);

  return(
    <div key={props.index} className="mb-5 mx-2">
      <FieldLabel key={props.index+"s_1"} index={props.index} id={props.fieldData.id} name={props.fieldData.name} required={props.fieldData.required} disabled={props.disabled} />
      <br/>
      <select key={props.index+props.fieldData.id+"s_2"} 
        id={props.fieldData.id} 
        className="bg-white border rounded-if w-full h-10/12 p-3.5"
        required={props.fieldData.required} disabled={props.disabled}
        value={props.repeatFields && props.formIndex!=null
          ?props.prefillValues[props.formIndex] && props.prefillValues[props.formIndex][props.fieldData.id]
            ?props.prefillValues[props.formIndex||0][props.fieldData.id]
            :""
          :props.prefillValues[props.fieldData.id]
            ?props.prefillValues[props.fieldData.id]
            :""
        }
        
        onChange={props.repeatFields && props.formIndex!=null
          ?(e)=>{
            props.setPrefillValues((curr:any)=>{
              curr[props.formIndex||0][props.fieldData.id]=e.target.value;
              return [...curr];
            })}
          :(e)=>{
            const val = e.target.value;
            
            props.setPrefillValues((curr:any)=>{curr[props.fieldData.id]=val; return {...curr}});
            if (props.setCovType && props.sectionType=="cov")
              props.setCovType(val);
            
            else if (props.setOldZone && props.fieldData.id=="Z")
              props.setOldZone(props.prefillValues["Z"]);
          }
        }
      >
        <option key={props.index+"_0"} value={""} disabled>Select {props.fieldData.name}</option>
        {(props.fieldData.options||[]).map((option:any,optionIndex:any)=>{
            if (optionIndex!=0)
          return <option key={props.index+"_"+optionIndex} value={option}>{option}</option>
        })}
      </select>
    </div>
  )
};

export default SelectField