import { useEffect, useState } from "react";
import { SubmitButtonStyling } from "./PurpleButtonStyling";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";

function FormDialogDocuments(props:any){
  const [open, setOpen] = useState(false);
  const [prefillValues, setPrefillValues] = useState<any>({});

  const validateRequiredFields=()=>{
    const data:any={};
    for (let i=0; i<props.form.length; i++){
      const field = props.form[i];
      if (field.category=="single")
        data[field.id] = field["required"]?true:false;

      else if (field.category=="grid"){
        for (let j=0; j<field.fields.length; j++){
          const gridField = field.fields[j];
          data[gridField.id] = gridField["required"]?true:false;
        }
      }
    }
    console.log("BOOLEAN ", data)
    for (let i=0; i<Object.keys(data).length; i++){
      const key = Object.keys(data)[i];
      const value = data[key];
      if (value && props.fieldValues[key]=="")
        return false;
    }
    return true;
  }

  useEffect(()=>{
    if (props.edit){
      props.setter(props.currentFields);
      setPrefillValues(props.currentFields)
  }
  },[props.fieldValues])  
  
  //to handle inputs of type text, password and email
  const handleText = (index:number, id:string, name: string, type: string, required:boolean, disabled:boolean,) => {
    return(
      <div key={index+id+"t_0"} className="mb-5">
        <label key={index+id+"t_1"} htmlFor={id} className="font-light text-lg">{name}</label>
        <input key={index+id+"t_2"} name="otp" autoComplete="garbage" id={id} type={type} disabled={disabled} required={required}
          className={`border rounded-if w-full h-full p-4  ${name==""?"mt-7":""}`}
          value={prefillValues[id]}
          onChange={(e)=>{
              props.setter((curr:any)=>{curr[id]=e.target.value; return curr});
              setPrefillValues((curr:any)=>{curr[id]=e.target.value; return {...curr};})
            }
          } 
        />
      </div>
    )
  };
  
  const handleSelect = (index:number, id:string, name: string, options: string[], required:boolean) => {
    try{
    return(
      <div key={index+id+"s_0"} className="mb-5">
        <label key={index+id+"s_1"} htmlFor={id} className="font-light text-lg">{name}</label>
        <br/>
        <select key={index+id+"s_2"} id={id} 
          className="bg-white border rounded-if w-full h-10/12 p-4"
          value={prefillValues[id]}
          required={required}
          onChange={(e)=>props.setter((curr:any)=>{curr[id]=Number(e.target.value)+1; return curr})
          } 
        >
          <option key={index+"_0"} value={""}>Select {name}</option>
          {options.map((option:any,optionIndex:any)=>{
            return <option key={index+"_"+optionIndex} value={optionIndex}>{option}</option>
          })}
        </select>
      </div>
    )}catch(err){
      return <></>
    }
  };
  
  const handleFile = (index:number, id:string, name:string, fileList:[File]) => {
    const [enableUpload, setEnableUpload] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const renderUploadButton = () => {
      console.log("RENDER UPLOAD")
      //setSubmitted(true);
      /* props.formSubmit().then((res:any)=>{
        setSubmitted(true);
        console.log(res);
      }).catch((err:any)=>{
        console.log(err);
      }); */
      
      return(
        <input key={index+name+"f_2"} id={id} type="file" style={{width:"0.1px", opacity:"0"}}
          onChange={
            (e)=>props.setter((curr:any)=>{
              if (e.target.files)
                curr[id]=[...curr[id],{"F":e.target.files[0], "N":e.target.files[0].name}];
              return curr;
            })
          }
        />
      )
    };

    return (
      <div key={index+name+"f_0"} className="flex flex-row">
        <div key={index+name+"f_-1"} className="font-light text-lg my-7">{name}:</div> 
        <label key={index+name+"f_1"} htmlFor={id} onClick={()=>setEnableUpload(validateRequiredFields())} className="bg-custom-1 text-white mx-3 my-5 border rounded-if p-3">Choose File(s)</label>
        <br/>
        {enableUpload?renderUploadButton():""}    
      </div>
    )
  }
  
  const handleTextArea = (index:number, id: string, name:string) => {
    return (
      <div  key={index}>
        <label htmlFor={id}>{name}</label>
        <textarea id={id} className={`border rounded-if w-full h-full p-4`} />
      </div>
    )
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className={props.triggerClassName}>{props.triggerText}</AlertDialogTrigger>
      <AlertDialogContent className={`bg-white overflow-y-scroll max-h-screen min-w-[800px] min-h-[300px] `}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-normal">{props.formTitle}</AlertDialogTitle>
          <hr/>
        </AlertDialogHeader>
        <form onSubmit={(e)=>{props.formSubmit(e); setOpen(false)}}>
          {props.form.map((field:any,index:number)=>{
            if (field["category"]=="single"){
              if (field["type"]=="text" || field["type"]=="email" || field["type"]=="password" || field["type"]=="date" || field["type"]=="number")
                return handleText(index, field["id"], field["name"], field["type"], field["required"]?true:false, field["disabled"]?true:false)
              else if (field["type"]=="select")
                return handleSelect(index, field["id"], field["name"], field["options"], field["required"]?true:false);
              else if (field["type"]=="file")
                return handleFile(index, field["id"], field["name"], field["fileList"]);
              else if (field["type"]=="textarea")
                return handleTextArea(index,field["id"], field["name"]);
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
                      if (item["type"]=="text" || item["type"]=="email" || item["type"]=="password" || item["type"]=="date" || item["type"]=="number" || item["type"]=="textarea")
                        return <span key={index+"_"+itemIndex} className="mr-3">{handleText(itemIndex, item["id"], item["name"], item["type"], item["required"]?true:false, item["disabled"]?true:false)}</span>
                      else if (item["type"]=="select")
                        return <span key={index+"_"+itemIndex} className="mr-3">{handleSelect(itemIndex, item["id"], item["name"], item["options"], item["required"]?true:false)}</span>
                      else if (item["type"]=="file")
                        return <span key={index+"_"+itemIndex} className="mr-3">{handleFile(itemIndex,item["id"], item["name"], field["fileList"])} </span>  
                    })}
                  </div>
                </div> 
              )
            }
          })}
          <br/>
          <AlertDialogCancel className="text-custom-1 border border-custom-1 rounded-xl h-12 w-36 mx-2 align-middle">Cancel</AlertDialogCancel>
          <button className={`float-right ${SubmitButtonStyling}`} type="submit" /* onClick={doSomeValidation} */ >
            {props.submitButton}
          </button>
        </form>
      </AlertDialogContent>
    </AlertDialog>    
  )
}

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
export default FormDialogDocuments;