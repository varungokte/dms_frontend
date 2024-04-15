import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PurpleButtonStyling from "./PurpleButtonStyling";

function FormDialog(props:any){

  //to handle inputs of type text, password and email

  const handleText = (label:string, setter: Function, type: string, prefillValue:string) => {
    return(
    <div className="mb-5">
      <label htmlFor={label} className="font-light text-lg">{label}</label>
      <input name="otp" autoComplete="garbage" id={label} type={type} onChange={(e)=>setter(e.target.value)} placeholder={prefillValue} className="border rounded-xl w-full h-full p-4"/>
    </div>
    )
  };
  
  const handleSelect = (label:string, setter: Function, options: [string], prefillValue:number) => {
    return(
      <div className="mb-5">
        <label htmlFor={label} className="font-light text-lg">{label}</label>
        <br/>
        <select id={label} onChange={(e:any)=>setter(e.target.value)} className="bg-white border rounded-xl w-full h-10/12 p-4">
          {options.map((option:any,index:any)=>{
            return <option value={index} selected={props.prefill&&prefillValue==index}>{option}</option>
          })}
        </select>
      </div>
    )
  };

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
                  return handleText(field["label"], field["setter"], field["type"], props.prefill?props.prefillValues[index]:"")
                else if (field["type"]=="select")
                  return handleSelect(field["label"], field["setter"], field["options"], props.prefill?props.prefillValues[index]:-1)
              }
              else if (field["category"]=="grid"){
                return(
                  <div className={`grid grid-cols-${field["row"]}`}>
                    {field.fields.map((item:any, itemIndex:number)=>{
                      if (item["type"]=="text" || item["type"]=="email" || item["type"]=="password" || item["type"]=="date")
                        return <span className="mr-3">{handleText(item["label"], item["setter"], item["type"], props.prefill?props.prefillValues[itemIndex]:"")}</span>

                      else if (item["type"]=="select")
                        return <span className="mr-3">{handleSelect(item["label"], item["setter"], item["options"], props.prefill?props.prefillValues[itemIndex]:-1)}</span>
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