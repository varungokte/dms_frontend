import { useEffect, useState } from "react";
import { DocumentStatusList } from "./../../Constants";
//import useGlobalContext from "../../GlobalContext";
import { FieldValues } from "./../../DataTypes";

import Search from "./BasicComponents/Search";
import { DataTable } from "./BasicComponents/Table";
import LoadingMessage from "./BasicComponents/LoadingMessage";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";
import UploadFileButton from "./BasicComponents/UploadFileButton";
import ViewFileButton from "./BasicComponents/ViewFileButton";

function Default(props:{label:string}) {
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);
  
  const [defaultData, setDefaultData] = useState<FieldValues[]>();

  const [searchString, setSearchString] = useState("");
  const [added, setAdded] = useState(true);

  useEffect(()=>{
    if (added){
      setDefaultData([
        {AID:"001",N:"Mortgage", T:"Payment", D:"01/01/01"},
        {AID:"002",N:"Home Loan", T:"Covenant", D:"02/02/02"},
        {AID:"003",N:"Business Loan", T:"Bankrupcy", D:"03/03/03"},
      ]);
      setAdded(false);
    }
  },[added])
  
  return(
    <div>
			<p className="text-3xl font-bold m-7">{props.label}</p>

      <div className='flex flex-row relative'>
        <div className=''>
          <Search setter={setSearchString} label="Search" className="mx-7"/>
        </div>
      </div>

      <div className="m-7">
        {defaultData
          ?defaultData.length==0
            ?<EmptyPageMessage sectionName="default cases" />
            :<DataTable className="rounded-xl bg-white"
              headingRows={["Sr. No.", "Name", "Agreement ID", "Default Type", "Default Date", "Action"]}
              headingClassNames={["font-medium text-center","text-center","text-center","text-center","text-center","text-center "]}
              cellClassName={["w-[100px]","","","","","w-[200px]"]}
              tableData={defaultData} dataTypes={["index","doc-link","text","text", "date","action"]} columnIDs={["AID","N","T", "D"]}
              searchRows={searchString==""?[]:[searchString,0]} filterRows={[]} 
              documentLinks={[]}
              action={
                defaultData.map((doc:any,index:number)=>{
                  if (!doc["S"] || doc["S"]==DocumentStatusList[1])
                    return <UploadFileButton key={index} index={index} 
                    AID={doc["AID"]} sectionName={doc["SN"]} docId={doc._id} 
                    setAdded={setAdded} 
                  />
                  else
                    return <ViewFileButton key={index} type="doc" 
                    AID={doc["AID"]} loanId={doc._loanId} docId={doc._id} sectionName={doc["SN"]} 
                    status={doc["S"]} rejectionReason={doc["R"]} 
                    setAdded={setAdded}
                    actualName={doc.FD[0].originalname||""} fileName={doc.FD[0].filename||""}
                    />
                })
              }
              />
          :<LoadingMessage sectionName="data" />
        }
      </div>
    </div>
  )
}
 
export default Default;