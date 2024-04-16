import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PurpleButtonStyling from "./PurpleButtonStyling";

function FormDialog(props:any){

  //to handle inputs of type text, password and email

  const handleText = (index:number, label:string, setter: Function, type: string, prefillValue:string) => {
    return(
      <div key={index+label+"t_0"} className="mb-5">
        <label key={index+label+"t_1"} htmlFor={label} className="font-light text-lg">{label}</label>
        <input key={index+label+"t_2"} name="otp" autoComplete="garbage" id={label} type={type} onChange={(e)=>setter(e.target.value)} placeholder={prefillValue} className="border rounded-xl w-full h-full p-4"/>
      </div>
    )
  };
  
  const handleSelect = (index:number, label:string, setter: Function, options: [string], prefillValue:number) => {
    return(
      <div key={index+label+"s_0"} className="mb-5">
        <label key={index+label+"s_1"} htmlFor={label} className="font-light text-lg">{label}</label>
        <br/>
        <select key={index+label+"s_2"} id={label} onChange={(e:any)=>setter(e.target.value)} className="bg-white border rounded-xl w-full h-10/12 p-4">
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
        <div>
          <label key={index+label+"f_1"} htmlFor={label} className="font-light text-lg">{label}</label>
          <br/>
          <input key={index+label+"f_2"} type="file" multiple onChange={(e:any)=>setter((curr:any)=>{curr.push(e.target.files); return curr;})} className="bg-white border text-custom-1 rounded-xl w-full h-10/12 p-4" />
        </div>
        <div key={index+label+"f_3"}>
        {fileList.map(doc=>{
          return(
            <div key={1}>{doc.name}</div>
          )
        })}</div>        
      </div>
    )
  }

  return (
    <Dialog>
      <DialogTrigger className={props.triggerClassName}>{props.triggerText}</DialogTrigger>
      <DialogContent className="bg-white min-w-[800px] min-h-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-normal">{props.formTitle}</DialogTitle>
          <hr/>
        </DialogHeader>
        <div>
          <form onSubmit={(e)=>{props.formSubmit(e)}}>
            {props.form.map((field:any,index:number)=>{
              if (field["category"]=="single"){
                if (field["type"]=="text" || field["type"]=="email" || field["type"]=="password" || field["type"]=="date")
                  return handleText(index, field["label"], field["setter"], field["type"], props.prefill?props.prefillValues[index]:"")
                else if (field["type"]=="select")
                  return handleSelect(index, field["label"], field["setter"], field["options"], props.prefill?props.prefillValues[index]:-1)
                else if (field["type"]=="file")
                  return handleFile(index, field["label"], field["setter"], field["fileList"]);
              }
              else if (field["category"]=="grid"){
                return(
                  <div className={`grid grid-cols-${field["row"]}`}>
                    {field.fields.map((item:any, itemIndex:number)=>{
                      if (item["type"]=="text" || item["type"]=="email" || item["type"]=="password" || item["type"]=="date")
                        return <span key={index+"_"+itemIndex} className="mr-3">{handleText(itemIndex, item["label"], item["setter"], item["type"], props.prefill?props.prefillValues[itemIndex]:"")}</span>
                      else if (item["type"]=="select")
                        return <span key={index+"_"+itemIndex} className="mr-3">{handleSelect(itemIndex, item["label"], item["setter"], item["options"], props.prefill?props.prefillValues[itemIndex]:-1)}</span>
                      else if (item["type"]=="file")
                        return <span key={index+"_"+itemIndex} className="mr-3">{handleFile(itemIndex,item["label"], item["setter"], field["fileList"])} </span>  
                    })}
                  </div>
                )
              }
            })}
            <DialogFooter>
              <DialogClose>
                <button type="submit" className={`float-right w-28 ${PurpleButtonStyling}`}>{props.submitButton}</button>
              </DialogClose>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
    
  )
}

export default FormDialog;

/* 
  <Dialog>
    <DialoggTrigger>Click Here </DialogTrigger>
    <DialogForm props />
  </Dialog>
 */

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