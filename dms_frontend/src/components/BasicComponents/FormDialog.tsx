import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PurpleButtonStyling from "./PurpleButtonStyling";
import { useState } from "react";

function FormDialog(props:any){
  const [open, setOpen] = useState(false);
  enum FormSizes {
    small= "min-w-[600px] min-h-[300px]",
    medium="min-w-[800px] min-h-[300px]",
    large="min-w-[1000px] min-h-[300px]"
  }

  //EDIT USER IN USER MANAGEMENT

  //to handle inputs of type text, password and email
  const handleText = (index:number, id:string, name: string, type: string, prefillValue:string) => {
    return(
      <div key={index+id+"t_0"} className="mb-5">
        <label key={index+id+"t_1"} htmlFor={id} className="font-light text-lg">{name}</label>
        <input key={index+id+"t_2"} name="otp" autoComplete="garbage" id={id} type={type} onChange={(e)=>props.setter((curr:any)=>{curr[id]=e.target.value; return curr})} placeholder={prefillValue} className={` border rounded-if w-full h-full p-4 ${props.large?"bg-red-600":""}`}/>
      </div>
    )
  };
  
  const handleSelect = (index:number, id:string, name: string, options: [string], prefillValue:number) => {
    return(
      <div key={index+id+"s_0"} className="mb-5">
        <label key={index+id+"s_1"} htmlFor={id} className="font-light text-lg">{name}</label>
        <br/>
        <select key={index+id+"s_2"} id={id} onChange={(e)=>props.setter((curr:any)=>{curr[id]=e.target.value; return curr})} className="bg-white border rounded-if w-full h-10/12 p-4">
          {options.map((option:any,optionIndex:any)=>{
            return <option key={optionIndex} value={optionIndex} selected={props.prefill&&prefillValue==optionIndex}>{option}</option>
          })}
        </select>
      </div>
    )
  };
  
  const handleFile = (index:number, label:string, setter:Function, fileList:[File]) => {
    return (
      <div key={index+label+"f_0"} className="flex flex-row mb-5">
        <div className="font-light text-lg">{label}:</div>
        <div>
          <label key={index+label+"f_1"} htmlFor={label} className="bg-custom-1 text-white mx-3 my-5 border rounded-if p-3">Choose File(s)</label>
          <br/>
          <input key={index+label+"f_2"} id={label} type="file" style={{width:"0.1px", opacity:"0"}} multiple onChange={(e:any)=>setter((curr:any)=>{curr.push(e.target.files); return curr;})} /* className="bg-white border text-custom-1 rounded-if w-full h-10/12 p-4" */ />
        </div>
        <div key={index+label+"f_3"}>
        {fileList.map(doc=>{
          console.log("CONAN",fileList)
          return(
            <div key={1}>{doc.name}</div>
          )
        })}</div>        
      </div>
    )
  }

  /* const handleTextClick = (index: number, label: string, setter:Function, )
 */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className={props.triggerClassName}>{props.triggerText}</DialogTrigger>
      {/* @ts-ignore */}
      <DialogContent className={`bg-white overflow-y-scroll max-h-screen ${FormSizes[props.formSize]} `}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">{props.formTitle}</DialogTitle>
          <hr/>
        </DialogHeader>
        
        <form onSubmit={(e)=>{props.formSubmit(e); setOpen(false)}}>
          {props.form.map((field:any,index:number)=>{
            if (field["category"]=="single"){
              if (field["type"]=="text" || field["type"]=="email" || field["type"]=="password" || field["type"]=="date" || field["type"]=="number")
                return handleText(index, field["id"], field["name"], field["type"], props.edit?props.userList[index][props.labelList.indexOf(field["id"])]:"")
              else if (field["type"]=="select")
                return handleSelect(index, field["id"], field["name"], field["options"], props.edit?props.userList[index][props.labelList.indexOf(field["id"])]:"")
              else if (field["type"]=="file")
                return handleFile(index, field["id"], field["name"], field["fileList"]);
            }
            else if (field["category"]=="grid"){
              let gridStyle = ""; 
              if (field["customWidth"])
                gridStyle = field["customWidth"]
              else
                gridStyle = field["row"];
              return(
                <div>
                  <div className="text-2xl font-medium my-2">{field["sectionName"]}</div>
                  <div className={`grid grid-cols-${gridStyle}`}>
                    {field.fields.map((item:any, itemIndex:number)=>{
                      if (item["type"]=="text" || item["type"]=="email" || item["type"]=="password" || item["type"]=="date" || item["type"]=="number"){
                        return <span key={index+"_"+itemIndex} className="mr-3">{handleText(itemIndex, item["id"], item["name"], item["type"], props.edit?props.userValues[item["id"]]:"")}</span>
                      }
                      else if (item["type"]=="select")
                        return <span key={index+"_"+itemIndex} className="mr-3">{handleSelect(itemIndex, item["id"], item["name"], item["options"], props.edit?props.userValues[item["id"]]:"")}</span>
                      else if (item["type"]=="file")
                        return <span key={index+"_"+itemIndex} className="mr-3">{handleFile(itemIndex,item["id"], item["name"], field["fileList"])} </span>  
                    })}
                  </div>
                </div> 
              )}
            })}
              <button className={`float-right w-28 ${PurpleButtonStyling}`} type="submit" >
                {props.submitButton}</button>
              </form>
      </DialogContent>
    </Dialog>
    
  )
}

export default FormDialog;

/* props:
    triggerClassName: {PurpleButtonStyling}
    triggerText: "Add User"
    formTitle: "Enter a user name"
    formSubmit: {createUser}
    submitButton: "Create User"
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