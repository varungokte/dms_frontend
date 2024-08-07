import { useEffect, useState, createElement, FormEventHandler, ReactElement } from "react";
import { FieldValues, FormFieldAttributes } from "DataTypes";
    
import TextField from "./TextField";
import SelectField from "./SelectField";
import DateField from "./DateField";
import IntegerField from "./IntegerField";
import FloatNumberField from "./FloatNumberField";

type RenderFormProps = {
  key:string,
  grid:FormFieldAttributes[], 
  fieldValues:FieldValues, 
  setter:Function, 
  formIndex:number, 
  repeatFields:boolean,
  disabled?:boolean,
}

function FormRepeatableGrid(props:{fieldList:FormFieldAttributes[], fieldValues:FieldValues, setFieldValues:Function, submitForm:FormEventHandler, fieldsInRow:number, disabled?:boolean}) {
  const [currentForm, setCurrentForm] = useState(0);
  const [propsList, setPropsList] = useState<RenderFormProps[]>([]);
  const [renderedComponentList, setRenderedComponentList] = useState<ReactElement[]>([]);

  //useEffect(()=>console.log(props),[props])
  
  useEffect(()=>{
    if (props.fieldValues && props.fieldValues.length!=0){
      setCurrentForm(props.fieldValues.length-1);
      const arr =  (props.fieldValues.map((_:any,index:number)=>{
        return { key:"f"+index, grid:props.fieldList, fieldValues:props.fieldValues, setter:props.setFieldValues, formIndex:index, repeatFields:true, disabled:props.disabled }
      }));
      setPropsList(arr);
    }
    else {
      setPropsList ([{ key:"f0", grid:props.fieldList, fieldValues:props.fieldValues, setter:props.setFieldValues, formIndex:currentForm, repeatFields:true, disabled:props.disabled }]);
      props.setFieldValues([{}])
    }
  },[props.fieldValues]);

  useEffect(()=>{
    setRenderedComponentList((curr:any)=>{
      curr = propsList.map((form:any)=>{
        form.fieldValues= props.fieldValues;
        return createElement(RenderForm, form);
      });
      return curr;
    })
  },[props.fieldValues,propsList]);
  
  return (
    <div className="">
      <br/>
      <div>
        {renderedComponentList.map((grid:any,index:number)=>{
          const fieldsInRow =props.fieldsInRow==2?`grid grid-cols-2`:`grid grid-cols-3`;
          return <div key={index} className={fieldsInRow}>{grid}</div>;
        })}
      </div>
      <div>
        {propsList.length>1 
          ?<button className="h-[50px] w-1/12 rounded-xl text-white text-lg bg-red-600 mr-5" type="button"
            onClick={()=>{
              setCurrentForm(curr=>curr-1);
              props.setFieldValues((curr:any)=>{
                curr.pop()
                return [...curr]
              })
              setPropsList((curr:any)=>curr.slice(0,-1))
            }}
          >-</button>
          :""
        }
        {props.disabled
          ?<></>
          :<button className="mt-10 h-[50px] w-1/12 rounded-xl text-white text-lg bg-custom-1" type="button"
            onClick={()=>{
              setCurrentForm(curr=> {return curr+1});
              props.setFieldValues((curr:any)=>{ curr=[...curr,{}]; return curr})
              setPropsList((curr:any)=>{return [...curr,{key:"f"+currentForm+1, grid:props.fieldList, fieldValues:props.fieldValues, setter:props.setFieldValues, formIndex:currentForm+1, repeatFields:true, disabled:props.disabled }]}); 
            }}
          >+</button>
        }
      </div>
      <br/>
    </div>
  )
}

function RenderForm(props:RenderFormProps) {
  return props.grid.map((item:any,index:number)=>{
    if (item.type=="select")
      return <SelectField key={index} index={index} fieldData={item} disabled={props.disabled||false} prefillValues={props.fieldValues} setPrefillValues={props.setter} repeatFields={props.repeatFields} formIndex={props.formIndex} />
    else if (item.type=="integer")
      return <IntegerField key={index} index={index} fieldData={item} disabled={props.disabled||false} prefillValues={props.fieldValues} setPrefillValues={props.setter} repeatFields={props.repeatFields} formIndex={props.formIndex} />
    else if (item.type=="float")
      return <FloatNumberField key={index} index={index} fieldData={item} disabled={props.disabled||false} prefillValues={props.fieldValues} setPrefillValues={props.setter} repeatFields={props.repeatFields} formIndex={props.formIndex} />
    else if (item.type=="date")
      return <DateField key={index} index={index} fieldData={item} disabled={props.disabled||false} prefillValues={props.fieldValues} setPrefillValues={props.setter} repeatFields={props.repeatFields} formIndex={props.formIndex} />
    else
      return <TextField key={index} index={index} fieldData={item} disabled={props.disabled||false} size="medium" prefillValues={props.fieldValues} setPrefillValues={props.setter} repeatFields={props.repeatFields} formIndex={props.formIndex} /> 
  })
}

export default FormRepeatableGrid;