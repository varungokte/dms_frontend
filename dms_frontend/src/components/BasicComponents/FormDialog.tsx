import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { SubmitButtonStyling } from "./PurpleButtonStyling";
import { ComboboxField, RoleField, SelectField, TextAreaField, TextField } from "./FormDialogFields";

function FormDialog(props:any){
  const [open, setOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState(0);
  
  enum FormSizes {
    small= "min-w-[600px] min-h-[300px]",
    medium= "min-w-[800px] min-h-[300px]",
    large= "min-w-[1000px] min-h-[300px]",
  };
  
  const [userNames] = useState([]);

  const [repeatForm, setRepeatForm] = useState([<RenderForm {...props} key={"f0"} formIndex={currentForm} userNames={userNames}/>]);

  return (
    <Dialog open={open} onOpenChange={setOpen} key={props.index}>
      <DialogTrigger onClick={()=>{
        console.log(props.currentField, props.setOldValues?"props.oldValues":"no values");
        if (props.setOldValues)
          props.setOldValues({...props.currentField});
        }} 
        className={props.triggerClassName}>{props.triggerText}</DialogTrigger>
      {/* @ts-ignore */}
      <DialogContent className={`bg-white overflow-y-scroll max-h-screen ${FormSizes[props.formSize]} `}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">{props.formTitle}</DialogTitle>
          <hr/>
        </DialogHeader>
        <form onSubmit={(e)=>{props.formSubmit(e); setOpen(false)}}>
          {repeatForm.map(form=>{return form})}
          {props.repeatFields&&(repeatForm.length>1) 
            ?<button className="h-[50px] w-1/12 rounded-xl text-white text-lg bg-red-600 mr-5" type="button" 
                onClick={()=>{
                  setCurrentForm(curr=>{return curr-1}); 
                  setRepeatForm(curr=>{return curr.slice(0,-1);})
                  props.setter(((curr:any)=>{ curr.pop(); return [...curr]}))
                }}
              >-</button>
            :""
          }
          {props.repeatFields
            ?<button className="h-[50px] w-1/12 rounded-xl text-white text-lg bg-custom-1" type="button" 
                onClick={()=>{
                  setCurrentForm(curr=>{return curr+1});
                  setRepeatForm(curr=>{return [...curr, <RenderForm {...props} key={"f"+currentForm+1} formIndex={currentForm+1} userNames={userNames} />]}); 
                  props.setter(((curr:any)=>{curr.push ({}); return curr}))
                }}
              >+</button>
            :""
          }
          <br/>
          <DialogClose className="text-custom-1 border border-custom-1 rounded-xl h-12 w-36 mx-2 align-middle">Cancel</DialogClose>
          <button className={`float-right ${SubmitButtonStyling}`} type="submit" /* onClick={doSomeValidation} */ >
            {props.submitButton}
          </button>
        </form>
      </DialogContent>
    </Dialog>    
  )
}

function RenderForm(props:any){
  const [prefillValues, setPrefillValues] = useState<any>({});

  useEffect(()=>{
    if (props.edit){
      props.setter(props.currentField);
      setPrefillValues(props.currentField)
    }
  },[props.fieldValues])
  
  return (
    props.form.map((field:any,index:number)=>{
      if (field["category"]=="single"){
        if (field["type"]=="select") 
          return <SelectField key={index} index={index} id={field["id"]} name={field["name"]} options={field["options"]}
          required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
          setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} 
          />
        else if (field["type"]=="textarea")
          return <TextAreaField key={index} index={index} id={field["id"]} name={field["name"]} 
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} 
          />
        else if (field["type"]=="role")
          return <RoleField key={index} index={index} id={field["id"]} name={field["name"]} 
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} 
          />
        else if (field["type"]=="combobox")
          return <ComboboxField key={index} index={index} id={field["id"]} name={field["name"]}
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} 
          />
        else
          return <TextField key={index} index={index} id={field["id"]} name={field["name"]} type={field["type"]}
          required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
          setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} 
          />
      }
      else if (field["category"]=="grid"){
        let gridStyle = "grid grid-cols-"; 
        if (field["customWidth"])
          gridStyle = "flex flex-row"
        else
          gridStyle = gridStyle + field["row"];
        return(
          <div key={index+"grid"}>
            <div key={index+"grid name"} className="text-2xl font-medium my-2">{field["sectionName"]}</div>
            <div key={index+"gridz"} className={gridStyle}>
              {field.fields.map((item:any, itemIndex:number)=>{
                if (item["type"]=="select")
                  return <span key={index+"_"+itemIndex} className="mr-3">
                    <SelectField key={index} index={index} id={item["id"]} name={item["name"]} options={item["options"]}
                      required={item["required"]} disabled={item["disabled"]?true:(item["immutable"]?(props.edit&&true):false)} 
                      setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} 
                    />
                  </span>
                else
                  return <span key={index+"_"+itemIndex} className="mr-3">
                    <TextField key={index} index={index} id={item["id"]} name={item["name"]} type={item["type"]}
                      required={item["required"]} disabled={item["disabled"]?true:(item["immutable"]?(props.edit&&true):false)} 
                      setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} 
                    />
                  </span>
              })}
            </div>
          </div> 
        )
      }
    })
  )
}

export default FormDialog;