import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import PurpleButtonStyling from "./PurpleButtonStyling";

function DialogForm(props:any){
  //to handle inputs of type text, password and email
  const handleText = (label:string, setter: Function, type: string) => {
    return(
    <div className="mb-5">
      <label htmlFor={label} className="text-lg">{label}</label>
      <input id={label} type={type} onChange={(e)=>setter(e.target.value)} className="border-2 rounded-xl w-full h-full p-3"/>
    </div>
    )
  };
  
  const handleSelect = (label:string, setter: Function, options: [string]) => {
    return(
      <div className="mb-5">
        <label htmlFor={label} className="text-lg">{label}</label>
        <br/>
        <select id={label} onChange={(e:any)=>setter(e.target.value)} className="bg-white border-2 rounded-xl w-full h-12 p-3">
          {options.map((option:any,index:any)=>{
            return (
              <option value={index}>{option}</option>
            )
          })}
        </select>
      </div>
    )
  };

  return (
    <DialogContent className="bg-white min-w-[600px] min-h-[400px]">
      <DialogHeader>
        <DialogTitle className="text-2xl">{props.title}</DialogTitle>
        <hr/>
        <DialogDescription>
          <form onSubmit={props.createUser}>
            {props.form.map((field:any)=>{
              if (field["category"]=="single"){
                if (field["type"]=="text" || field["type"]=="email" || field["type"]=="password" || field["type"]=="date")
                  return handleText(field["label"], field["setter"], field["type"])
                else if (field["type"]=="select")
                  return handleSelect(field["label"], field["setter"], field["options"])
              }
              else if (field["category"]=="grid"){
                return(
                  <div className={`grid grid-cols-2`}>
                    {field.fields.map((item:any)=>{
                      if (item["type"]=="text" || item["type"]=="email" || item["type"]=="password" || item["type"]=="date")
                        return <span className="mr-3">{handleText(item["label"], item["setter"], item["type"])}</span>

                      else if (item["type"]=="select")
                        return <span className="mr-3">{handleSelect(item["label"], item["setter"], item["options"])}</span>

                      else if (item["type"]=="subgrid"){
                        return(
                          <div className="mb-5">
                            <div className="flex m-auto">
                              <label htmlFor="permission" className="text-lg">Permissions</label>
                              <br/>
                              {item["fields"].map((subitem:any)=>{
                                if (subitem["type"]=="checkbox"){
                                  return (
                                    <div className="mx-5">
                                      <input type="checkbox" id={subitem["label"]} className="mr-1"/>
                                      <label htmlFor={subitem["label"]}>{subitem["label"]}</label>
                                    </div>
                                  )
                                }
                              })}
                            </div>
                          </div>
                        )
                      }
                    })}
                  </div>
                )
              }
              })}
            <button type="submit" className={`float-right w-28 ${PurpleButtonStyling}`}>{props.submitButton}</button>
          </form>
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  )
}

export default DialogForm;

/* 
  <Dialog>
    <DialoggTrigger>Click Here </DialogTrigger>
    <DialogForm props />
  </Dialog>
 */

/* props:
      title: "Enter a user name"
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
          number:4, 
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