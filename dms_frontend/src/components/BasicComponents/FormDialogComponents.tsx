import { useEffect, useState } from "react";

function TextField (props:{index:number, id:string, name: string, type: string, required:boolean, disabled:boolean, setter:Function, prefillValues:any, setPrefillValues:Function }) {
  return(
    <div key={props.index+props.id+"t_0"} className="mb-5">
      <label key={props.index+props.id+"t_1"} htmlFor={props.id} className="font-light text-lg">{props.name} {props.required?<span className="text-red-600">*</span>:""}</label>
      <input key={props.index+props.id+"t_2"} name="otp" autoComplete="garbage" id={props.id} type={props.type} disabled={props.disabled} required={props.required}
        className={`border rounded-if w-full h-full p-4  ${props.name==""?"mt-7":""}`}
        value={props.prefillValues[props.id]}
        onChange={(e)=>{
            props.setter((curr:any)=>{curr[props.id]=e.target.value; return curr});
            props.setPrefillValues((curr:any)=>{curr[props.id]=e.target.value; return {...curr};})
          }
        } 
      />
    </div>
  )
};

function SelectField (props:{index:number, id:string, name: string, options: string[], required:boolean, disabled:boolean, setter:Function, prefillValues:any, setPrefillValues:Function}){
  try{
    return(
      <div key={props.index+props.id+"s_0"} className="mb-5">
        <label key={props.index+props.id+"s_1"} htmlFor={props.id} className="font-light text-lg">{props.name} {props.required?<span className="text-red-600">*</span>:""}</label>
        <br/>
        <select key={props.index+props.id+"s_2"} id={props.id} 
          className="bg-white border rounded-if w-full h-10/12 p-4"
          value={props.prefillValues[props.id]}
          required={props.required}
          onChange={(e)=>props.setter((curr:any)=>{curr[props.id]=Number(e.target.value)+1; console.log("THE NEW CURR", curr); return curr})
          } 
        >
          <option key={props.index+"_0"} value={""}>Select {props.name}</option>
          {props.options.map((option:any,optionIndex:any)=>{
            return <option key={props.index+"_"+optionIndex} value={optionIndex}>{option}</option>
          })}
        </select>
      </div>
    )
  } 
  catch(err){
    return <></>
  }
};

function TextAreaField (props:{index:number, id: string, name:string, setter:Function, prefillValues:any, setPrefillValues:Function}) {
  return (
    <div key={props.index}>
      <label htmlFor={props.id}>{props.name}</label>
      <textarea id={props.id} className={`border rounded-if w-full h-full p-4`}
        onChange={(e)=>{
          props.setter((curr:any)=>{curr[props.id]=e.target.value; return curr});
          props.setPrefillValues((curr:any)=>{curr[props.id]=e.target.value; return {...curr};})
        }}
      />
    </div>
  )
};

function FileField (props:{index:number, id:string, name:string, required:boolean, fileList:any, validateRequiredFields:Function, fileSetter:Function}) {
  const [enableUpload, setEnableUpload] = useState(false);
  const statusList = [<p className="text-blue-500">Uploading...</p>,<p className="text-green-500">Completed</p>,<p className="text-red-500">Rejected</p>]

  const uploadFile = async (file:File) => {
    console.log("Received", file);
    setTimeout(() => {
      console.log("uploading...")
    }, 3000);
    return 200;
  }

  useEffect(()=>{
    if (props.fileList.length<1)
      return;
    for (let i=0; i<props.fileList.length; i++){
      if (props.fileList[i][1]==0){
        uploadFile(props.fileList[i][0]).then(res=>{
          console.log(i,res)
          if (res==200){
            props.fileSetter((curr:any)=>{
              curr[i][1]=1;
              console.log("THE NEW CURR",curr);
              return curr;
            })
          }
        }).catch(err=>{
          props.fileSetter((curr:any)=>{
            curr[i][1]=2;
            console.log("THE NEW CURR",curr);
            return curr;
          })
        })
      }  
    };
  },[props.fileList]);

  const renderUploadButton = () => {
    //console.log("RENDER UPLOAD");
    return(
      <input key={props.index+props.name+"f_2"} id={props.id} type="file" style={{width:"0.1px", opacity:"0"}} 
        required={props.required}
        multiple
        onChange={
          (e)=>props.fileSetter((curr:any)=>{
            const arr  = [...curr];
            if (e.target.files && e.target.files.length>0)
              for (let i=0; i<e.target.files.length; i++)
                arr.push([{"F":e.target.files[i], "N":e.target.files[i].name},0])
            return arr;
          })
        }
      />
    )
  };

  const renderList = () => {
    if (!props.fileList || props.fileList.length<1)
      return <></>;

    return (
      props.fileList.map((item:any,index:number)=>{
        return (
          <div className="border p-3 flex flex-row">
            <div key={index} className="flex-auto">
              <p>{item[0]["N"]}</p>
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
        <div key={props.index+props.name+"f_-1"} className="font-light text-lg my-7">{props.name}:</div> 
        <label key={props.index+props.name+"f_1"} htmlFor={props.id} onClick={()=>setEnableUpload(props.validateRequiredFields())} className="bg-custom-1 text-white mx-3 my-5 border rounded-if p-3">Choose File(s)</label>
        {enableUpload?renderUploadButton():""}
      </div>
      <div>
        {renderList()}
      </div>
    </div>
  )
}

export { TextField, SelectField, TextAreaField, FileField };