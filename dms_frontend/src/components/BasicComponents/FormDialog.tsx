import { useEffect, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ComboboxField, DateField, NumberField, RoleField, SelectField, TextAreaField, TextField } from "./FormFieldsDialog";
import { SubmitButtonStyling } from "./PurpleButtonStyling";

function FormDialog(props:{index:number, formTitle:string, triggerText:any, triggerClassName?:string, formSubmit:Function, formSize:"small"|"medium"|"large", fieldValues:any, setter:Function, form:any, submitButton:string, currentFields:any, repeatFields?:boolean, edit?:boolean }){
  const [open, setOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState(0); 
  const [prefillValues, setPrefillValues] = useState<any>({});

  enum FormSizes {
    small= "min-w-[600px] min-h-[300px]",
    medium= "min-w-[800px] min-h-[300px]",
    large= "min-w-[1000px] min-h-[300px]",
  };

  const [repeatForm, setRepeatForm] = useState([<RenderForm key={"f0"} formIndex={currentForm} setter={props.setter} edit={props.edit||false} currentFields={props.currentFields} fieldValues={props.fieldValues} form={props.form} prefillValues={{...prefillValues}} setPrefillValues={setPrefillValues} />]);
  
  const submitFunction = () => {
    console.log("pre submit prefil values", prefillValues);
    props.formSubmit(prefillValues);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen} key={props.index}>
      <DialogTrigger className={props.triggerClassName||""}>{props.triggerText}</DialogTrigger>
      <DialogContent className={`bg-white overflow-y-scroll max-h-screen ${FormSizes[props.formSize]} `}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">{props.formTitle}</DialogTitle>
          <hr/>
        </DialogHeader>
          {props.repeatFields
            ?<>
              {repeatForm.map(form=>{return form})}
              {(repeatForm.length>1) 
                ?<button className="h-[50px] w-1/12 rounded-xl text-white text-lg bg-red-600 mr-5" type="button" 
                    onClick={()=>{
                      setCurrentForm(curr=>{return curr-1}); 
                      setRepeatForm(curr=>{return curr.slice(0,-1);})
                      props.setter(((curr:any)=>{ curr.pop(); return [...curr]}))
                    }}
                  >-</button>
                :""
              }
              <button className="h-[50px] w-1/12 rounded-xl text-white text-lg bg-custom-1" type="button" 
                onClick={()=>{
                  setCurrentForm(curr=>{return curr+1});
                  setRepeatForm(curr=>{return [...curr, <RenderForm {...props} key={"f"+currentForm+1} formIndex={currentForm+1}  setter={props.setter} edit={props.edit||false} currentFields={props.currentFields} fieldValues={props.fieldValues} form={props.form} prefillValues={prefillValues} setPrefillValues={setPrefillValues} />]}); 
                  props.setter(((curr:any)=>{curr.push ({}); return curr}))
                }}
              >+</button>
            </>
            :<RenderForm key={"f0"} formIndex={currentForm} setter={props.setter} edit={props.edit||false} currentFields={props.currentFields} fieldValues={props.fieldValues} form={props.form} prefillValues={{...prefillValues}} setPrefillValues={setPrefillValues} />
          }
          <br/>
          <DialogClose className="text-custom-1 border border-custom-1 rounded-xl h-12 w-36 mx-2 align-middle">Cancel</DialogClose>
          <button className={`float-right ${SubmitButtonStyling}`} type="button" onClick={()=>submitFunction()} >
            {props.submitButton}
          </button>
      </DialogContent>
    </Dialog>
  )
}

function RenderForm(props:{formIndex:number, setter:Function, edit:boolean, currentFields:any, fieldValues:any, form:any, prefillValues:any, setPrefillValues:Function}){
  useEffect(()=>{
    if (props.edit)
      props.setPrefillValues(props.currentFields);
    else
    props.setPrefillValues(props.fieldValues);
  },[props.fieldValues,props.currentFields]);

  return (
    props.form.map((field:any,index:number)=>{
      if (field["category"]=="single"){
        if (field["type"]=="select") 
          return <SelectField key={index} index={index} id={field["id"]} name={field["name"]} options={field["options"]}
          required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
          prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
          />
        else if (field["type"]=="number")
          return <NumberField key={index} index={index} id={field["id"]} name={field["name"]} 
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
          />
        else if (field["type"]=="date")
          return <DateField key={index} index={index} id={field["id"]} name={field["name"]} 
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
          />
        else if (field["type"]=="textarea")
          return <TextAreaField key={index} index={index} id={field["id"]} name={field["name"]} 
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
          />
        else if (field["type"]=="role")
          return <RoleField key={index} index={index} id={field["id"]} name={field["name"]} 
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            prefillValues={{...props.prefillValues}} setPrefillValues={props.setPrefillValues} 
          />
        else if (field["type"]=="combobox")
          return <ComboboxField key={index} index={index} id={field["id"]} name={field["name"]}
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
          />
        else
          return <TextField key={index} index={index} id={field["id"]} name={field["name"]} type={field["type"]}
            required={field["required"]} disabled={field["disabled"]?true:(field["immutable"]?(props.edit&&true):false)} 
            prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
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
                      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
                    />
                  </span>
                else
                  return <span key={index+"_"+itemIndex} className="mr-3">
                    <TextField key={index} index={index} id={item["id"]} name={item["name"]} type={item["type"]}
                      required={item["required"]} disabled={item["disabled"]?true:(item["immutable"]?(props.edit&&true):false)} 
                      prefillValues={props.prefillValues} setPrefillValues={props.setPrefillValues} 
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