import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { SubmitButtonStyling } from "./PurpleButtonStyling";
import { ComboboxField, RoleField, TextAreaField } from "./FormDialogFields";

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

  const handleText = (index:number, id:string, name: string, type: string, disabled:boolean, required:boolean, immutable:boolean) => {
    if (props.edit && immutable)
      disabled=true;
    return(
      <div key={index+id+"t_0"} className="mb-5">
        <label key={index+id+"t_1"} htmlFor={id} className="font-light text-lg">{name} {required?<span className="text-red-600">*</span>:""}</label>
        <input key={index+id+"t_2"} name="otp" autoComplete="garbage" id={id} type={type} disabled={disabled} required={required}
          className={`border rounded-if w-full h-full p-4  ${name==""?"mt-7":""}`}
          value={prefillValues[id] || ""}
          onChange={props.repeatFields
            ?(e)=>{
              props.setter((curr:any)=>{curr[props.formIndex][id]=e.target.value; return curr;})
              setPrefillValues((curr:any)=>{curr[props.formIndex][id]=e.target.value; return {...curr};})
            }
            :(e)=>{
              props.setter((curr:any)=>{curr[id]=e.target.value; return curr});
              setPrefillValues((curr:any)=>{curr[id]=e.target.value; return {...curr};})
            }
          } 
        />
      </div>
    )
  };
  
  const handleSelect = (index:number, id:string, name: string, options: string[], required:boolean, disabled:boolean, immutable:boolean) => {
    try{
    if (props.edit && immutable)
      disabled=true;
    return(
      <div key={index+id+"s_0"} className="mb-5">
        <label key={index+id+"s_1"} htmlFor={id} className="font-light text-lg">{name} {required?<span className="text-red-600">*</span>:""}</label>
        <br/>
        <select key={index+id+"s_2"} id={id} 
          className="bg-white border rounded-if w-full h-10/12 p-4"
          required={required}
          value={prefillValues[id]}
          onChange={props.repeatFields
            ?(e)=>props.setter((curr:any)=>{curr[props.formIndex][id]=e.target.value; return curr;})
            :(e)=>props.setter((curr:any)=>{curr[id]=e.target.value; return curr})
          } 
        >
          <option value={""}>Select {name}</option>
          {options.map((option:any,optionIndex:any)=>{
            return <option key={index+"_"+optionIndex} value={optionIndex+1}>{option}</option>
          })}
        </select>
      </div>
    )}catch(err){
      console.log(err);
      return <></>
    }
  };

  return (
    props.form.map((field:any,index:number)=>{
      if (field["category"]=="single"){
        if (field["type"]=="select")
          return handleSelect(index, field["id"], field["name"], field["options"], field["required"], field["disabled"], field["immutable"]?true:false)
        else if (field["type"]=="textarea")
          return <TextAreaField key={index} index={index} id={field["id"]} name={field["name"]} required={field["required"]} disabled={field["disabled"]} setter={props.setter} prefillValues={prefillValues} immutable={field["immutable"]?(props.edit&&true):false} setPrefillValues={setPrefillValues} />
        else if (field["type"]=="role")
          return <RoleField key={index} index={index} id={field["id"]} name={field["name"]} setter={props.setter} required={field["required"]} disabled={field["disabled"]} prefillValues={prefillValues} immutable={field["immutable"]?(props.edit&&true):false} setPrefillValues={setPrefillValues} />
        else if (field["type"]=="combobox")
          return <ComboboxField key={index} index={index} id={field["id"]} name={field["name"]} setter={props.setter} prefillValues={prefillValues} immutable={field["immutable"]?(props.edit&&true):false} setPrefillValues={setPrefillValues} />
        else
          return handleText(index, field["id"], field["name"], field["type"], field["disabled"]?true:false, field["required"]?true:false, field["immutable"]?true:false)
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
                  return <span key={index+"_"+itemIndex} className="mr-3">{handleSelect(itemIndex, item["id"], item["name"], item["options"], item["required"],field["disabled"], item["immutable"]?true:false)}</span>
                else
                  return <span key={index+"_"+itemIndex} className="mr-3">{handleText(itemIndex, item["id"], item["name"], item["type"], item["disabled"]?true:false, item["required"]?true:false, item["immutable"]?true:false)}</span>
              })}
            </div>
          </div> 
        )
      }
    })
  )
}

export default FormDialog;

/* props:
    triggerClassName: {PurpleButtonStyling}
    triggerText: "Add User"
    formTitle: "Enter a user name"
    formSubmit: {createUser}
    submitButton: "Create User"
    formSize: "small" || "medium" || "large"
    form: 
    [
      { 
        category: "single", 
        label: "Name", 
        type: "text",
        setter: setNewName
      }, 
      {
        category: grid, 
        sectionTitle: "User Info"
        row:4, //Number of rows
        fields:
        [
          {
            type: "email"
            label: "Email",
            setter: setNewEmail
          }, 
          {
            type: "password",
            label: "Password",
            setter: setNewPassword
          }, 
          {
            type: "select",
            label: "Role",
            setter: setNewRole
            options: ["Admin", "Maker", "Checker"]
          }
        ]
      }
    ]    
  */