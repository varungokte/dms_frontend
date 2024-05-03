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
    medium="min-w-[800px] min-h-[300px]",
    large="min-w-[1000px] min-h-[300px]"
  }
  
  const [userNames, setUserNames] = useState([]);
  
  useEffect(()=>{
    console.log("SILURIANS", userNames);
  },[userNames])
  
  
  const callAPI = () => {
    props.apiFunction().then((res:any)=>{
      console.log (res)
      setUserNames(res.U);
    })
  }
  
  const [repeatForm, setRepeatForm] = useState([<RenderForm {...props} formIndex={currentForm} userNames={userNames}/>]);

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
                  setRepeatForm(curr=>{return [...curr, <RenderForm {...props} formIndex={currentForm+1} userNames={userNames} />]}); 
                  props.setter(((curr:any)=>{return [...curr, {}]}))
                }}
              >+</button>
            :""
          }
          <br/>
          <button className={`float-right ${SubmitButtonStyling}`} type="submit" >
            {props.submitButton}
          </button>
        </form>
      </DialogContent>
    </Dialog>
    
  )
}

function RenderForm (props:any){
  //to handle inputs of type text, password and email
  const handleText = (index:number, id:string, name: string, type: string, prefillValue:string) => {
    return(
      <div key={index+id+"t_0"} className="mb-5">
        <label key={index+id+"t_1"} htmlFor={id} className="font-light text-lg">{name}</label>
        <input key={index+id+"t_2"} name="otp" autoComplete="garbage" id={id} type={type} placeholder={prefillValue}
          className={`border rounded-if w-full h-full p-4 ${props.large?"bg-red-600":""}`}
          
          onChange={props.repeatFields
            ?(e)=>props.setter((curr:any)=>{curr[props.formIndex][id]=e.target.value; return curr;})
            :(e)=>props.setter((curr:any)=>{curr[id]=e.target.value; return curr})
          } 
        />
      </div>
    )
  };
  
  const handleSelect = (index:number, id:string, name: string, options: [string], prefillValue:number) => {
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
            return <option key={index+"_"+optionIndex} value={optionIndex} selected={props.prefill&&prefillValue==optionIndex}>{option}</option>
          })}
        </select>
      </div>
    )
  };
  
  const handleFile = (index:number, label:string, setter:Function, fileList:[File]) => {
    return (
      <div key={index+label+"f_0"} className="flex flex-row mb-5">
        <div key={index+label+"f_-1"} className="font-light text-lg">{label}:</div>
        <label key={index+label+"f_1"} htmlFor={label} className="bg-custom-1 text-white mx-3 my-5 border rounded-if p-3">Choose File(s)</label>
        <br/>
        <input key={index+label+"f_2"} id={label} type="file" style={{width:"0.1px", opacity:"0"}} multiple onChange={(e:any)=>setter((curr:any)=>{curr.push(e.target.files); return curr;})} /* className="bg-white border text-custom-1 rounded-if w-full h-10/12 p-4" */ />
        <div key={index+label+"f_3"}>
          {fileList.map(doc=>{
            console.log("CONAN",fileList)
            return(
              <div key={1}>{doc.name}</div>
            )
          })}
        </div>        
      </div>
    )
  }

  const handlePermissions = (index:number, id:string, name:string) => {
    return (
      <div key={index+"p_0"}>
        <label htmlFor={id}>{name}</label>
        <PermissionSetter newRole={true} setter={props.setter} />
      </div>
    )
  };

  const handleCombobox = (index:number, id:string, name:string) =>{
    const [obj, setObj] = useState({});
    useEffect(()=>{
      console.log("handleCO,nox",props.suggestions)
      props.repeatFields
        ?props.setter((curr:any)=>{curr[props.formIndex][id]=obj; return curr;})
        :props.setter((curr:any)=>{curr[id]=obj; return curr})
    },[obj])

    const [people, setPeople] = useState([
      {N:"Bruce Wayne",E:"Batman"}, 
      {N:"Lando Calrissian",E:"Administrator"}, 
      {N:"Lucy McLean", E:"Vault Dweller"},
      {N:"Kara Danvers", E:"Supergirl"}, 
      {N:"Conan O'Brien", E:"Talk-show Host"}, 
      {N:"Brigadier Lethbridge-Stewart", E:"UNIT Guy"}
    ]);

    return(
      <div key={index+id+"c_0"} className="mb-5" style={{zIndex: "90"}}>
        <label key={index+id+"c_1"} htmlFor={id} className="font-light text-lg">{name}</label>
        <Combobox 
          className={`border rounded-if w-full h-full p-4`}
          optionsList={props.suggestions}
          finalResult={obj}
          setFinalResult={setObj}
          displayMultipleLines={true}
          displayFields={["N","E"]} 
        />
      </div>
    )
  }
  return (
    props.form.map((field:any,index:number)=>{
    if (field["category"]=="single"){
      if (field["type"]=="text" || field["type"]=="email" || field["type"]=="password" || field["type"]=="date" || field["type"]=="number")
        return handleText(index, field["id"], field["name"], field["type"], props.edit?props.userList[index][props.labelList.indexOf(field["id"])]:"")
      else if (field["type"]=="select")
        return handleSelect(index, field["id"], field["name"], field["options"], props.edit?props.userList[index][props.labelList.indexOf(field["id"])]:"")
      else if (field["type"]=="file")
        return handleFile(index, field["id"], field["name"], field["fileList"]);
      else if (field["type"]=="permissions")
        return handlePermissions(index, field["id"], field["name"]);
    }
    else if (field["category"]=="grid"){
      let gridStyle = ""; 
      if (field["customWidth"])
        gridStyle = field["customWidth"]
      else
        gridStyle = field["row"];
      return(
        <div key={index+"grid"}>
          <div key={index+"grid name"} className="text-2xl font-medium my-2">{field["sectionName"]}</div>
          <div key={index+"gridz"} className={`grid grid-cols-${gridStyle}`}>
            {field.fields.map((item:any, itemIndex:number)=>{
              if (item["type"]=="text" || item["type"]=="email" || item["type"]=="password" || item["type"]=="date" || item["type"]=="number")
                return <span key={index+"_"+itemIndex} className="mr-3">{handleText(itemIndex, item["id"], item["name"], item["type"], props.edit?props.userValues[item["id"]]:"")}</span>
              else if (item["type"]=="select")
                return <span key={index+"_"+itemIndex} className="mr-3">{handleSelect(itemIndex, item["id"], item["name"], item["options"], props.edit?props.userValues[item["id"]]:"")}</span>
              else if (item["type"]=="file")
                return <span key={index+"_"+itemIndex} className="mr-3">{handleFile(itemIndex,item["id"], item["name"], field["fileList"])} </span>  
              else if (item["type"]=="combobox")
                return <span key={index+"_"+itemIndex} className="mr-3" style={{position:"relative"}}>{handleCombobox(itemIndex, item["id"], item["name"])}</span>
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