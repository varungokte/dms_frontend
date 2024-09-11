import { useEffect, useState, createElement, ReactElement } from "react";
import { FormRepeatableGridProps, RenderFormGridProps } from "@/types/FormComponentProps";
    
import TextField from "../FormFieldComponents/TextField";
import SelectField from "../FormFieldComponents/SelectField";
import DateField from "../FormFieldComponents/DateField";
import IntegerField from "../FormFieldComponents/IntegerField";
import FloatNumberField from "../FormFieldComponents/FloatNumberField";

function FormRepeatableGrid(props:FormRepeatableGridProps) {
  const [currentForm, setCurrentForm] = useState(0);
  const [propsList, setPropsList] = useState<RenderFormGridProps[]>([]);
  const [renderedComponentList, setRenderedComponentList] = useState<ReactElement[]>([]);
  
  useEffect(()=>{
    if (props.fieldValues && props.fieldValues.length!=0){
      setCurrentForm(props.fieldValues.length-1);
      const arr =  (props.fieldValues.map((_:any,index:number)=>{
        return { key:"f"+index, grid:props.fieldList, fieldValues:props.fieldValues, setter:props.setFieldValues, formIndex:index, repeatFields:true, disabled:props.disabled, readonly:props.readonly }
      }));
      setPropsList(arr);
    }
    else {
      setPropsList ([{ key:"f0", grid:props.fieldList, fieldValues:props.fieldValues, setter:props.setFieldValues, formIndex:currentForm, repeatFields:true, disabled:props.disabled, readonly:props.readonly }]);
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
        {propsList.length>1 && !props.disabled
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
              setPropsList((curr:any)=>{return [...curr,{key:"f"+currentForm+1, grid:props.fieldList, fieldValues:props.fieldValues, setter:props.setFieldValues, formIndex:currentForm+1, repeatFields:true, disabled:props.disabled, readonly:props.readonly }]}); 
            }}
          >+</button>
        }
      </div>
      <br/>
    </div>
  )
}

function RenderForm(props:RenderFormGridProps) {
  return props.grid.map((item,index)=>{
    const value = props.fieldValues[props.formIndex][item.id];

    if (item.type=="select")
      return <SelectField key={index} index={index} fieldData={item} disabled={props.disabled||false} fieldValue={value} setFieldValues={props.setter} repeatFields={props.repeatFields} formIndex={props.formIndex} readonly={props.readonly} />
    else if (item.type=="integer")
      return <IntegerField key={index} index={index} fieldData={item} disabled={props.disabled||false} fieldValue={value} setFieldValues={props.setter} repeatFields={props.repeatFields} formIndex={props.formIndex} readonly={props.readonly} />
    else if (item.type=="float")
      return <FloatNumberField key={index} index={index} fieldData={item} disabled={props.disabled||false} fieldValue={value} setFieldValues={props.setter} repeatFields={props.repeatFields} formIndex={props.formIndex} readonly={props.readonly} />
    else if (item.type=="date")
      return <DateField key={index} index={index} fieldData={item} disabled={props.disabled||false} fieldValue={value} setFieldValues={props.setter} repeatFields={props.repeatFields} formIndex={props.formIndex} readonly={props.readonly} />
    else
      return <TextField key={index} index={index} fieldData={item} disabled={props.disabled||false} size="medium" fieldValue={value} setFieldValues={props.setter} repeatFields={props.repeatFields} formIndex={props.formIndex} readonly={props.readonly} /> 
  })
}

export default FormRepeatableGrid;