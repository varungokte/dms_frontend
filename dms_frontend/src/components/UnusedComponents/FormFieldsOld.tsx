/* import { useEffect, useState, createElement, FormEventHandler } from "react";

function FormTextField(props:{id:string, name:string, type:string, required:boolean, disabled:boolean, fieldValues:any, setter:Function,repeatFields?:boolean, formIndex?:number}) {
  return (
    <div className="my-3">
      <label htmlFor={props.id}>{props.name} {props.required?<span className="text-red-600">*</span>:""}</label>
      <br/>
      <input className="border-2 p-4 w-4/5 rounded-xl" 
        id={props.id} type={props.type}
        required={props.required} disabled={props.disabled}
        min={props.type=="number"?0:""}
        value={props.repeatFields && props.formIndex!=null
          ?(props.id in props.fieldValues[props.formIndex]?(props.fieldValues[props.formIndex][props.id]==-1?"":props.fieldValues[props.formIndex][props.id]):"")
          :props.fieldValues[props.id]==null?"":(props.fieldValues[props.id]==-1?"":props.fieldValues[props.id])
        }
        onChange={props.repeatFields && props.formIndex!=null
          ?(e)=>{
            props.setter((curr:any)=>{
              curr[props.formIndex||0][props.id] = e.target.value;
              console.log("new curr",curr)
              return [...curr];
            })
          }
          :(e)=>{
            props.setter((curr:any)=>{
              if (props.id=="HA" && curr["SA"] && Number(e.target.value)>Number(curr["SA"]))
                return {...curr}
              curr[props.id] = e.target.value;
              if ((props.id=="SA" || props.id=="HA") && (curr["HA"] && curr["SA"]))
                curr["DA"] = Number(curr["SA"])-Number(curr["HA"]);
              return {...curr};
          })
          }
        } 
      />
    </div>
  )
}

function FormNumberField(props:{id:string, name:string, required:boolean, disabled:boolean, fieldValues:any, setter:Function,repeatFields?:boolean, formIndex?:number}) {
  return (
    <div className="my-3">
      <label htmlFor={props.id}>{props.name} {props.required?<span className="text-red-600">*</span>:""}</label>
      <br/>
      <input className="border-2 p-4 w-4/5 rounded-xl" 
        id={props.id}
        required={props.required} disabled={props.disabled}
        min={0}
        value={props.repeatFields && props.formIndex!=null
          ?(props.id in props.fieldValues[props.formIndex]?(props.fieldValues[props.formIndex][props.id]==-1?"":props.fieldValues[props.formIndex][props.id]):"")
          :props.fieldValues[props.id]==null?"":(props.fieldValues[props.id]==-1?-1:Number(props.fieldValues[props.id]))
        }
        onChange={props.repeatFields && props.formIndex!=null
          ?(e)=>{
            props.setter((curr:any)=>{
              curr[props.formIndex||0][props.id] = e.target.value;
              console.log("new curr",curr)
              return [...curr];
            })
          }
          :(e)=>{
            props.setter((curr:any)=>{
              if (props.id=="HA" && curr["SA"] && Number(e.target.value)>Number(curr["SA"]))
                return {...curr}
              curr[props.id] = e.target.value;
              if ((props.id=="SA" || props.id=="HA") && (curr["HA"] && curr["SA"]))
                curr["DA"] = Number(curr["SA"])-Number(curr["HA"]);
              return {...curr};
          })
          }
        } 
      />
    </div>
  )
}

function FormSelectField(props:{id:string, name:string, required:boolean, disabled:boolean, fieldValues:any, setter:Function, options:any,repeatFields?:boolean, formIndex?:number}) {
  return (
    <div className="my-3">
      <label htmlFor={props.id}>{props.name} {props.required?<span className="text-red-600">*</span>:""}</label>
      <br/>
      <select className="border-2 bg-white w-4/5 p-4 rounded-xl" id={props.id} disabled={props.disabled} required={props.required}
        value={props.repeatFields && props.formIndex!=null
          ?props.fieldValues[props.formIndex][props.id]==null?-1:props.fieldValues[props.formIndex][props.id]
          :props.fieldValues[props.id]==null?-1:props.fieldValues[props.id]
        } 
        onChange={props.repeatFields && props.formIndex!=null
          ?(e)=>{
            props.setter((curr:any)=>{
              curr[props.formIndex||0][props.id] = e.target.value;
              return [...curr];
          })}
          :(e)=>{
          props.setter((curr:any)=>{
            curr[props.id] = e.target.value;
            return {...curr};
          })
        }}
      >
        <option className="font-light" key={-1} value={""}>Select {props.name}</option>
        {props.options.map((option:any, index:number)=>{
          return <option key={index} value={index+1}>{option}</option>
        })}
      </select>
    </div>
  )
}

function FormRepeatableGrid(props:{fieldList:any, fieldValues:any, setFieldValues:Function, submitForm:FormEventHandler, fieldsInRow:number, preexistingValues?:boolean}) {
  const [currentForm, setCurrentForm] = useState(0);
  const [repeatForm, setRepeatForm] = useState<any>([]);
  const [renderRepeatForm, setRenderRepeatForm] = useState<any>([]);

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
              setCurrentForm(curr=>{return curr-1});
              setRepeatForm((curr:any)=>{return curr.slice(0,-1);})
            }}
          >-</button>
          :""
        }
        <button className="mt-10 h-[50px] w-1/12 rounded-xl text-white text-lg bg-custom-1" type="button"
          onClick={()=>{
            setCurrentForm(curr=> {return curr+1});
            props.setFieldValues((curr:any)=>{console.log('the old curr',curr); console.log("the type of old curr", typeof curr); curr=[...curr,{}]; console.log('the new curr', curr); return curr})
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
    return item.type=="select"?
      <FormSelectField id={item.id} key={index} name={item.name} options={item.options} setter={props.setter} disabled={false} fieldValues={props.fieldValues} required={item.required} repeatFields={props.repeatFields} formIndex={props.formIndex} />
      :<FormTextField id={item.id} key={index} name={item.name} setter={props.setter} disabled={false} fieldValues={props.fieldValues} required={item.required} type={item.type} repeatFields={props.repeatFields} formIndex={props.formIndex} /> 
  })
}

export { FormSelectField, FormTextField, FormRepeatableGrid, FormNumberField }; */