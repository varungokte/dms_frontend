import { useEffect, useState, createElement } from "react";

function FormTextField(props:{id:string, name:string, type:string, required:boolean, disabled:boolean, fieldValues:any, setter:Function}) {
  return (
    <div className="my-3">
      <label htmlFor={props.id}>{props.name} {props.required?<span className="text-red-600">*</span>:""}</label>
      <br/>
      <input className="border-2 p-4 w-4/5 rounded-xl" 
        id={props.id}
        type={props.type}
        required={props.required}
        disabled={props.disabled}
        min={props.type=="number"?0:""}
        value={props.fieldValues[props.id]==null?"":(props.fieldValues[props.id]==-1?"":props.fieldValues[props.id])}
        onChange={(e)=>{
          props.setter((curr:any)=>{
            curr[props.id] = e.target.value;
            return {...curr};
          })
        }}
      />
    </div>
  )
}

function FormSelectField(props:{id:string, name:string, required:boolean, disabled:boolean, fieldValues:any, setter:Function, options:any}) {
  return (
    <div className="my-3">
      <label htmlFor={props.id}>{props.name} {props.required?<span className="text-red-600">*</span>:""}</label>
      <br/>
      <select className="border-2 bg-white w-4/5 p-4 rounded-xl" id={props.id} disabled={props.disabled}
        value={props.fieldValues[props.id]==null?-1:props.fieldValues[props.id]} 
        onChange={(e)=>{
          props.setter((curr:any)=>{
            curr[props.id] = e.target.value;
            return {...curr};
          })
        }}
      >
        <option className="font-light" key={-1} value={-1}>Select {props.name}</option>
        {props.options.map((option:any, index:number)=>{
          return <option key={index} value={index+1}>{option}</option>
        })}
      </select>
    </div>
  )
}

function FormRepeatableGrid(props:{grid:any, fieldValues:any, setter:Function}) {
  const [currentForm, setCurrentForm] = useState(0);
  const [fieldValues, setFieldValues] = useState(props.fieldValues);
  const [repeatForm, setRepeatForm] = useState<any>([{ key:"f0", grid:props.grid, fieldValues:props.fieldValues, setter: props.setter, formIndex:currentForm }]);
  const [renderRepeatForm, setRenderRepeatForm] = useState<any>([createElement(RenderForm, repeatForm[0])])

  useEffect(()=>{
    console.log("render list",renderRepeatForm);
  },[renderRepeatForm])

  useEffect(()=>{
    setFieldValues(props.fieldValues);
  },[props.fieldValues]);

  useEffect(()=>{
    setRenderRepeatForm((curr:any)=>{
      curr = repeatForm.map((form:any)=>{
        form.fieldValues = fieldValues;
        return createElement(RenderForm, form);
      });
      return curr;
    })
  },[fieldValues,repeatForm]);

  return(
    <>
      {renderRepeatForm.map((grid:any)=>{
        return grid;
      })}
      <div>
        {repeatForm.length>1 
          ?<button className="h-[50px] w-1/12 rounded-xl text-white text-lg bg-red-600 mr-5" type="button" 
              onClick={()=>{
                setCurrentForm(curr=>{return curr-1}); 
                setRepeatForm((curr:any)=>{return curr.slice(0,-1);})
              }}
            >-</button>
          :""
        }
        <button className="mt-10 h-[50px] w-2/12 rounded-xl text-white text-lg bg-custom-1" type="button"
          onClick={()=>{
            setCurrentForm(curr=> {return curr+1});
            setRepeatForm((curr:any)=>{return [...curr,{key:"f"+currentForm+1, grid:props.grid, fieldValues:{...fieldValues}, setter:props.setter, formIndex:currentForm+1 }]}); 
          }}
        >+</button>
          <br/>
      </div>
    </>
  )
}

function RenderForm(props:{grid:any, fieldValues:any, setter:Function, formIndex:number}) {
  return props.grid.map((item:any,index:number)=>{  
    return item.type=="select"?
      <FormSelectField id={item.id+(props.formIndex+1)} key={index} name={item.name} options={item.options} setter={props.setter} disabled={false} fieldValues={{...props.fieldValues}} required={item.required} />
    :<FormTextField id={item.id+(props.formIndex+1)} key={index} name={item.name} setter={props.setter} disabled={false} fieldValues={props.fieldValues}  required={item.required} type={item.type} /> 
  })
}

export {FormTextField, FormSelectField, FormRepeatableGrid, RenderForm};

/* 
props:
  id, name, required = true || false, type = "text" || "number" || etc, setter = setFieldName
*/