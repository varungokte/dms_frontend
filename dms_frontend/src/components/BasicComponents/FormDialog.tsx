import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { SubmitButtonStyling } from "./PurpleButtonStyling";
import PermissionSetter from "./PermissionSetter";
import Combobox from "./Combobox";

function FormDialog(props:any){
  const [open, setOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState(0);
  
  enum FormSizes {
    small= "min-w-[600px] min-h-[300px]",
    medium= "min-w-[800px] min-h-[300px]",
    large= "min-w-[1000px] min-h-[300px]"
  }
  
  const [userNames, setUserNames] = useState([]);

  const [repeatForm, setRepeatForm] = useState([<RenderForm {...props} key={"f0"} formIndex={currentForm} userNames={userNames}/>]);

  const doSomeValidation = () => {
    
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger /* onClick={()=>{if (props.apiCallOnClick){callAPI()}}} */ className={props.triggerClassName}>{props.triggerText}</DialogTrigger>
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
          <button className={`float-right ${SubmitButtonStyling}`} type="submit" /* onClick={doSomeValidation} */ >
            {props.submitButton}
          </button>
        </form>
      </DialogContent>
    </Dialog>    
  )
}

function RenderForm (props:any){
  const [optionsList, setOptionsList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [permissionList, setPermissionList] = useState([]);
  const [currentPermission, setCurrentPermission] = useState(0);
  const [prefillValues, setPrefillValues] = useState<any>({});


  useEffect(()=>{
    console.log("LOADED")
  })
  useEffect(()=>{
    if (props.edit){
      props.setter(props.currentFields);
      console.log(props.fieldValues);
      setPrefillValues(props.currentFields)
  }
  },[props.fieldValues])

  /* useEffect(()=>{
    console.log("GETTING DATA", optionsList);
    console.log("PROCESSED DATA", optionsList.map(user=>{return {values: user, label:`${user["N"]}<${user["E"]}>`}}))
  },[optionsList]) */

  useEffect(()=>{
    if (!props.suggestionsFunction)
      return;
    props.suggestionsFunction().then((res:any)=>{
      if (res.U)
        setOptionsList(res.U);
      if (res.R){
        setRolesList(res.R.map((role:any)=>{return role.N}));
        setPermissionList(res.R.map((role:any)=>{return JSON.parse(role.P)}))
      }
    })
  },[]);

  //to handle inputs of type text, password and email
  const handleText = (index:number, id:string, name: string, type: string, disabled:boolean, required:boolean) => {
    console.log(required)
    return(
      <div key={index+id+"t_0"} className="mb-5">
        <label key={index+id+"t_1"} htmlFor={id} className="font-light text-lg">{name}</label>
        <input key={index+id+"t_2"} name="otp" autoComplete="garbage" id={id} type={type} disabled={disabled} required={required}
          className={`border rounded-if w-full h-full p-4  ${name==""?"mt-7":""}`}
          value={prefillValues[id]}
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
  
  const handleSelect = (index:number, id:string, name: string, options: string[]) => {
    try{
    return(
      <div key={index+id+"s_0"} className="mb-5">
        <label key={index+id+"s_1"} htmlFor={id} className="font-light text-lg">{name}</label>
        <br/>
        <select key={index+id+"s_2"} id={id} 
          className="bg-white border rounded-if w-full h-10/12 p-4"
          onChange={props.repeatFields
            ?(e)=>props.setter((curr:any)=>{curr[props.formIndex][id]=e.target.value; return curr;})
            :(e)=>props.setter((curr:any)=>{curr[id]=e.target.value; return curr})
          } 
        >
          {options.map((option:any,optionIndex:any)=>{
            return <option key={index+"_"+optionIndex} selected={prefillValues[id]==optionIndex} value={optionIndex}>{option}</option>
          })}
        </select>
      </div>
    )}catch(err){
      console.log(err);
      return <></>
    }
  };
  
  const handleFile = (index:number, id:string, name:string, fileList:[File]) => {
    const [error, setError] = useState(<></>);
    return (
      <div key={index+name+"f_0"} className="flex flex-row">
        <div key={index+name+"f_-1"} className="font-light text-lg my-7">{name}:</div>
        <label key={index+name+"f_1"} htmlFor={id} className="bg-custom-1 text-white mx-3 my-5 border rounded-if p-3">Choose File(s)</label>
        <br/>
        <input key={index+name+"f_2"} id={id} type="file" style={{width:"0.1px", opacity:"0"}} 
          onChange={props.repeatFields
            ?(e)=>props.setter((curr:any)=>{ if (e.target.files) curr[props.formIndex][id]=(e.target.files[0]); console.log(e.target.files); return curr;})
            :(e)=>props.setter((curr:any)=>{ 
              if (e.target.files) { 
                if (e.target.files[0].size>500)
                  console.log("TOO MUCH") 
                curr[id]=[...curr[id],(e.target.files[0])];
              } 
              console.log(curr); 
              return curr
            })
          }
        />
        <div key={index+name+"f_3"}>
          {props.fieldValues?props.fieldValues["F"].map((doc:any, docIndex:number)=>{
            console.log("CONAN",props.fieldValues)
            return(
              <div key={docIndex}>{doc.name}</div>
            )
          }):""}
        </div>        
      </div>
    )
  }

  const handlePermissions = (index:number, id:string, name:string) => {
    return (
      <div key={index+"p_0"}>
        <label htmlFor={id}>{name}</label>
        <PermissionSetter newRole={true} setter={props.setter} singleRole={permissionList[0]}  />
      </div>
    )
  };

  const handleRole = (index:number, id:string, name:string) => {
    return(
      <div key={index+id+"s_0"} className="mb-5">
        <label key={index+id+"s_1"} htmlFor={id} className="font-light text-lg">{name}</label>
        <br/>
        <select key={index+id+"s_2"} id={id} 
          className="bg-white border rounded-if w-full h-10/12 p-4"
          onChange={props.repeatFields
            ?(e)=>{props.setter((curr:any)=>{curr[props.formIndex][id]=e.target.value; return curr;});setCurrentPermission(Number(e.target.value))}
            :(e)=>{props.setter((curr:any)=>{curr[id]=e.target.value; return curr}); setCurrentPermission(Number(e.target.value))}
          } 
        >
          {rolesList.map((option:any,optionIndex:any)=>{
            return <option key={index+"_"+optionIndex} value={optionIndex}>{option}</option>
          })}
        </select>
      </div>
    )
  }

  const handleCombobox = (index:number, id:string, name:string) =>{
    const [obj, setObj] = useState({});
    
    useEffect(()=>{
      console.log("OBJ", obj)
      props.repeatFields
        ?props.setter((curr:any)=>{curr[props.formIndex][id]=obj; return curr;})
        :props.setter((curr:any)=>{curr[id]=obj; return curr})
    },[obj]);

    return(
      <div key={index+id+"c_0"} className="mb-5">
        <label key={index+id+"c_1"} htmlFor={id} className="font-light text-lg">{name}</label>
        <Combobox 
          type="double"
          searchFields={["N","E"]}
          optionsList={optionsList.map(user=>{return {values: user, label:`${user["N"]}<${user["E"]}>`}})} 
          label="User" 
          value={obj}
          setValue={setObj}
        />
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
    props.form.map((field:any,index:number)=>{
      if (field["category"]=="single"){
        if (field["type"]=="text" || field["type"]=="email" || field["type"]=="password" || field["type"]=="date" || field["type"]=="number")
          return handleText(index, field["id"], field["name"], field["type"], field["disabled"]?true:false, field["required"]?true:false)
        else if (field["type"]=="select")
          return handleSelect(index, field["id"], field["name"], field["options"])
        else if (field["type"]=="file")
          return handleFile(index, field["id"], field["name"], field["fileList"]);
        else if (field["type"]=="permissions")
          return handlePermissions(index, field["id"], field["name"]);
        else if (field["type"]=="role")
          return handleRole(index, field["id"], field["name"])
        else if (field["type"]=="textarea")
          return handleTextArea(index,field["id"], field["name"])
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
                  return <span key={index+"_"+itemIndex} className="mr-3">{handleText(itemIndex, item["id"], item["name"], item["type"], item["disabled"]?true:false, item["required"]?true:false)}</span>
                else if (item["type"]=="select")
                  return <span key={index+"_"+itemIndex} className="mr-3">{handleSelect(itemIndex, item["id"], item["name"], item["options"])}</span>
                else if (item["type"]=="file")
                  return <span key={index+"_"+itemIndex} className="mr-3">{handleFile(itemIndex,item["id"], item["name"], field["fileList"])} </span>  
                else if (item["type"]=="combobox")
                  return <span key={index+"_"+itemIndex} className="mr-3" style={{position:"relative"}}>{handleCombobox(itemIndex, item["id"], item["name"])}</span>
                else if (item["type"]=="role")
                  return <span key={index+"_"+itemIndex} className="mr-3" style={{position:"relative"}}>{handleRole(itemIndex, item["id"], item["name"])}</span>
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