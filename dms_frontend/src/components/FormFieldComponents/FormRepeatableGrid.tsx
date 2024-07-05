import { useEffect, useState, createElement, FormEventHandler } from "react";
import { FieldValues } from "DataTypes";
    
import TextField from "./TextField";
import SelectField from "./SelectField";
import DateField from "./DateField";
import NumberField from "./NumberField";
import NumberDecimalField from "./NumberDecimalField";

function FormRepeatableGrid(props:{fieldList:FieldValues[], fieldValues:FieldValues, setFieldValues:Function, submitForm:FormEventHandler, fieldsInRow:number, preexistingValues?:boolean}) {
  const [currentForm, setCurrentForm] = useState(0);
  const [repeatForm, setRepeatForm] = useState<any>([]);
  const [renderRepeatForm, setRenderRepeatForm] = useState<any>([]);

  //useEffect(()=>console.log(props),[props])
  
  useEffect(()=>{
    if (props.preexistingValues){
      setCurrentForm(props.fieldValues.length-1);
      const arr =  (props.fieldValues.map((_:any,index:number)=>{
        return { key:"f"+index, grid:props.fieldList, fieldValues:props.fieldValues, setter:props.setFieldValues, formIndex:index, repeatFields:true }
      }));
      setRepeatForm(arr);
    }
    else {
      setRepeatForm ([{ key:"f0", grid:props.fieldList, fieldValues:props.fieldValues, setter:props.setFieldValues, formIndex:currentForm, repeatFields:true }]);
      props.setFieldValues([{}])
    }
  },[props.preexistingValues]);

  useEffect(()=>{
    setRenderRepeatForm((curr:any)=>{
      curr = repeatForm.map((form:any)=>{
        form.fieldValues= props.fieldValues;
        return createElement(RenderForm, form);
      });
      return curr;
    })
  },[props.fieldValues,repeatForm]);
  
  return (
    <div className="">
      <br/>
      <div>
        {renderRepeatForm.map((grid:any,index:number)=>{
          const fieldsInRow =props.fieldsInRow==2?`grid grid-cols-2`:`grid grid-cols-3`;
          return <div key={index} className={fieldsInRow}>{grid}</div>;
        })}
      </div>
      <div>
        {repeatForm.length>1 
          ?<button className="h-[50px] w-1/12 rounded-xl text-white text-lg bg-red-600 mr-5" type="button"
            onClick={()=>{
              setCurrentForm(curr=>curr-1);
              props.setFieldValues((curr:any)=>{
                curr.pop()
                return [...curr]
              })
              setRepeatForm((curr:any)=>curr.slice(0,-1))
            }}
          >-</button>
          :""
        }
        <button className="mt-10 h-[50px] w-1/12 rounded-xl text-white text-lg bg-custom-1" type="button"
          onClick={()=>{
            setCurrentForm(curr=> {return curr+1});
            props.setFieldValues((curr:any)=>{ curr=[...curr,{}]; return curr})
            setRepeatForm((curr:any)=>{return [...curr,{key:"f"+currentForm+1, grid:props.fieldList, fieldValues:props.fieldValues, setter:props.setFieldValues, formIndex:currentForm+1, repeatFields:true }]}); 
          }}
        >+</button>
      </div>
      <br/>
    </div>
  )
}

function RenderForm(props:{grid:any, fieldValues:any, setter:Function, formIndex:number, repeatFields:boolean}) {
  return props.grid.map((item:any,index:number)=>{
    if (item.type=="select")
      return <SelectField id={item.id} key={index} index={index} name={item.name} options={item.options} disabled={false} prefillValues={props.fieldValues} setPrefillValues={props.setter} required={item.required} repeatFields={props.repeatFields} formIndex={props.formIndex} />
    else if (item.type=="integer")
      return <NumberField id={item.id} key={index} index={index} name={item.name} disabled={false} prefillValues={props.fieldValues} setPrefillValues={props.setter} required={item.required} repeatFields={props.repeatFields} formIndex={props.formIndex} />
    else if (item.type=="float")
      return <NumberDecimalField id={item.id} key={index} index={index} name={item.name} disabled={false} prefillValues={props.fieldValues} setPrefillValues={props.setter} required={item.required} repeatFields={props.repeatFields} formIndex={props.formIndex} />
    else if (item.type=="date")
      return <DateField id={item.id} key={index} index={index} name={item.name} disabled={false} prefillValues={props.fieldValues} setPrefillValues={props.setter} required={item.required} repeatFields={props.repeatFields} formIndex={props.formIndex} />
    else
      return <TextField id={item.id} key={index} index={index} name={item.name} disabled={false} prefillValues={props.fieldValues} setPrefillValues={props.setter} required={item.required} type={item.type} repeatFields={props.repeatFields} formIndex={props.formIndex} /> 
  })
}

export default FormRepeatableGrid;