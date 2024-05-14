import { useEffect, useState } from "react";
import { SubmitButtonStyling } from "./PurpleButtonStyling";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog";
import { SelectField, TextAreaField, TextField } from "./FormDialogFields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";

function FormDialogDocuments(props:any){
  const [open, setOpen] = useState(false);
  const [prefillValues, setPrefillValues] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState(<></>);
  const [currentTab, setCurrentTab] = useState("details");

  useEffect(()=>{
    console.log("FIELD VALUES OF THE COVENANT", props.fieldValues)
    if (props.edit){
      props.setter(props.currentFields);
      setPrefillValues(props.currentFields)
    }
  },[props.fieldValues]);

  useEffect(()=>{
    console.log("th prefill values", prefillValues);
  },[])

  const validateRequiredFields=()=>{
    const data:any={};
    for (let i=0; i<props.detailForm.length; i++){
      const field = props.detailForm[i];
      if (field.category=="single")
        data[field.id] = field["required"]?true:false;

      else if (field.category=="grid"){
        for (let j=0; j<field.fields.length; j++){
          const gridField = field.fields[j];
          data[gridField.id] = gridField["required"]?true:false;
        }
      }
    }
    for (let i=0; i<Object.keys(data).length; i++){
      const key = Object.keys(data)[i];
      const value = data[key];
      if (value && (props.fieldValues[key]=="" || !props.fieldValues[key])){
        setErrorMessage(<p className="text-red-600">Please fill all required fields.</p>)
        return false;
      }
    }
    setErrorMessage(<></>);
    setCurrentTab("upload");
    return true;
  }

  const submitDetails = async () => {
    console.log("Reached submit")
    const res = await props.formSubmit();
    if (res==200)
      setOpen(false);
    else
      console.log("You've got a problem, si ",res);
  }

  useEffect(()=>{
    setCurrentTab("details");
  },[open])

  return(
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className={props.triggerClassName}>{props.triggerText}</AlertDialogTrigger>
      <AlertDialogContent className={`bg-white overflow-y-scroll max-h-screen min-w-[800px] h-lvh `}>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-normal">{props.formTitle}</AlertDialogTitle>
          <hr/>
        </AlertDialogHeader>
        <Tabs value={currentTab} onValueChange={setCurrentTab} defaultValue={"details"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Document Details</TabsTrigger>
            <TabsTrigger value="upload">File Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Document Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <form onSubmit={(e)=>{props.formSubmit(e);}}>
                  {props.detailForm.map((field:any,index:number)=>{
                    if (field["category"]=="single"){
                      if (field["type"]=="select")
                        return <SelectField key={index} index={index} id={field["id"]} name={field["name"]} required={field["required"]?true:false} options={field["options"]} disabled={field["disabled"]?true:false} setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} />
                      else if (field["type"]=="file")
                        return <></>
                      else if (field["type"]=="textarea")
                        return <TextAreaField key={index} index={index} id={field["id"]} name={field["name"]} setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} />
                      else
                        return <TextField key={index} index={index} id={field["id"]} name={field["name"]} type={field["type"]} required={field["required"]?true:false} disabled={field["disabled"]?true:false} setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} />
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
                                return <span key={index+"_"+itemIndex} className="mr-3"><SelectField index={index} id={item["id"]} name={item["name"]} required={item["required"]?true:false} options={item["options"]} disabled={item["disabled"]?true:false} setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} /></span>
                              else
                                return <span key={index+"_"+itemIndex} className="mr-3"><TextField index={index} id={item["id"]} name={item["name"]} type={item["type"]} required={item["required"]?true:false} disabled={item["disabled"]?true:false} setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} /></span>  
                            })}
                          </div>
                        </div> 
                      )
                    }
                  })}
                  {errorMessage}
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle>File Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
              <FileField key={100} index={100} id={props.uploadForm["id"]} name={props.uploadForm["name"]} required={props.uploadForm["required"]?true:false} fileList={props.fileList} fileSetter={props.fileSetter} validateRequiredFields={validateRequiredFields} formSubmit={props.formSubmit} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <AlertDialogFooter>
          <AlertDialogCancel className="text-custom-1 border border-custom-1 rounded-xl h-12 w-36 mx-2 align-middle">Cancel</AlertDialogCancel>
          <button className={SubmitButtonStyling} onClick={()=>{currentTab=="details"?validateRequiredFields():submitDetails()}}>{currentTab=="details"?"Next":"Save"}</button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>  
  )
};

function FileField (props:{index:number, id:string, name:string, required:boolean, fileList:any, validateRequiredFields:Function, fileSetter:Function, formSubmit:Function}) {
  const statusList = [<p className="text-blue-500">Uploading...</p>,<p className="text-green-500">Completed</p>,<p className="text-red-500">Rejected</p>]

  const renderList = () => {
    if (!props.fileList || props.fileList.length<1)
      return <></>;

    return (
      props.fileList.map((item:any,index:number)=>{
        return (
          <div className="border p-3 flex flex-row">
            <div key={index} className="flex-auto">
              <p>{item.name}</p>
              {statusList[item[1]]}
            </div>
            <button type="button">x</button>
          </div>
        )
      })
    )
  };

  return (
    <div>
      <div key={props.index+props.name+"f_0"} className="flex flex-row">
        <label key={props.index+props.name+"f_1"} htmlFor={props.id} className="bg-custom-1 text-white my-5 border rounded-if p-3">Choose File(s)</label>
        <input key={props.index+props.name+"f_2"} id={props.id} type="file" style={{width:"0.1px", opacity:"0"}} 
          required={props.required}
          multiple
          onChange={
            (e)=>props.fileSetter((curr:any)=>{
              const arr  = [...curr];
              if (e.target.files && e.target.files.length>0)
                for (let i=0; i<e.target.files.length; i++)
                  arr.push(e.target.files[i])
              return arr;
            })
          }
        />
      </div>
      <div>
        {renderList()}
      </div>
    </div>
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

/* function FormDialogDocuments(props:any){
  const [open, setOpen] = useState(false);
  const [prefillValues, setPrefillValues] = useState<any>({});
  const [errorMessage, setErrorMessage] = useState(<></>);

  useEffect(()=>{
    console.log("FIELD VALUES OF THE COVENANT", props.fieldValues)
    if (props.edit){
      props.setter(props.currentFields);
      setPrefillValues(props.currentFields)
    }
  },[props.fieldValues])

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
    for (let i=0; i<Object.keys(data).length; i++){
      const key = Object.keys(data)[i];
      const value = data[key];
      if (value && (props.fieldValues[key]=="" || !props.fieldValues[key])){
        setErrorMessage(<p className="text-red-600">Please fill all required fields before uploading a file.</p>)
        return false;
      }
    }
    setErrorMessage(<></>)
    return true;
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
              if (field["type"]=="select")
                return <SelectField key={index} index={index} id={field["id"]} name={field["name"]} required={field["required"]?true:false} options={field["options"]} disabled={field["disabled"]?true:false} setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} />
              else if (field["type"]=="file")
                return <FileField key={index} index={index} id={field["id"]} name={field["name"]} required={field["required"]?true:false} fileList={props.fileList} fileSetter={props.fileSetter} validateRequiredFields={validateRequiredFields} />
              else if (field["type"]=="textarea")
                return <TextAreaField key={index} index={index} id={field["id"]} name={field["name"]} setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} />
              else
                return <TextField key={index} index={index} id={field["id"]} name={field["name"]} type={field["type"]} required={field["required"]?true:false} disabled={field["disabled"]?true:false} setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} />
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
                      if (item["type"]=="select"){
                        if (item["dependsOn"]){
                          if (props.fieldValues[item["dependsOn"]]==item["dependsValue"])
                            return <span key={index+"_"+itemIndex} className="mr-3"><SelectField index={index} id={item["id"]} name={item["name"]} required={item["required"]?true:false} options={item["options"]} disabled={item["disabled"]?true:false} setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} /></span>
                        }
                        else
                          return <span key={index+"_"+itemIndex} className="mr-3"><SelectField index={index} id={item["id"]} name={item["name"]} required={item["required"]?true:false} options={item["options"]} disabled={item["disabled"]?true:false} setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} /></span>
                      }
                        
                      else
                        return <span key={index+"_"+itemIndex} className="mr-3"><TextField index={index} id={item["id"]} name={item["name"]} type={item["type"]} required={item["required"]?true:false} disabled={item["disabled"]?true:false} setter={props.setter} prefillValues={prefillValues} setPrefillValues={setPrefillValues} /></span>  
                    })}
                  </div>
                </div> 
              )
            }
          })}
          {errorMessage}
          <br/>
          <AlertDialogCancel className="text-custom-1 border border-custom-1 rounded-xl h-12 w-36 mx-2 align-middle">Cancel</AlertDialogCancel>
          <button className={`float-right ${SubmitButtonStyling}`} type="button" onClick={props.formSubmit} >
            {props.submitButton}
          </button>
        </form>
      </AlertDialogContent>
    </AlertDialog>    
  )
}
 */