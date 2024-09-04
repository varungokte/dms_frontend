import { useContext, useEffect, useState } from "react";
import { DocumentStatusList } from "@/functions/Constants";
import { getDocSecList, getDocSecName, getModSecName } from "@/functions/sectionNameAttributes";
import { FieldValues, ToastOptionsAttributes } from "@/types/DataTypes";

import { DataTable } from "./BasicTables/Table";

import LoadingMessage from "./BasicMessages/LoadingMessage";
import EmptyPageMessage from "./BasicMessages/EmptyPageMessage";
//import Tabs from '@mui/material/Tabs';
//import Tab from '@mui/material/Tab';

import UploadFileButton from "./BasicButtons/UploadFileButton";
import ViewFileButton from "./BasicButtons/ViewFileButton";
import { PermissionContext } from "@/functions/Contexts";
import { Pagination } from "./BasicComponents/Pagination";
import Filter from "./BasicComponents/Filter";
import Toast from "./BasicComponents/Toast";
import { getSpecialList } from "@/apiFunctions/specialCaseAPIs";

function SpecialCases(props:{label:string, panopticPage?:boolean}) {
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);
  
  const [allData, setAllData] = useState<FieldValues[]>();

  const admin = props.panopticPage||false;
  const type = getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})=="default"?"def":"crit";
	const [currentSection, setCurrentSection] = useState<string>(getDocSecName({inputName:"TD",inputType:"keyname",outputType:"fullname"}));

  const [added, setAdded] = useState(true);
  const [documentLinks,setDocumentLinks] = useState<{section:string,index:string|number}[]>([]);

  const {userPermissions} = useContext(PermissionContext);

  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isDeleted, setIsDeleted] = useState<number>();

  useEffect(()=>{
    setAdded(true);
  },[currentSection]);

  useEffect(()=>{
    setAdded(true);
  },[currentPage,rowsPerPage]);

  useEffect(()=>{
    if (!isDeleted)
      return;

    if (isDeleted==200)
      setToastOptions({open:true, type:"success", action:"delete", section:"File"});
    else
      setToastOptions({open:true, type:"error", action:"delete", section:"File"});

    setIsDeleted(undefined);
  },[isDeleted]);

  useEffect(()=>{
    if (added){
      getSpecialList({type, admin, sectionName:getDocSecName({inputName:currentSection,inputType:"fullname",outputType:"keyname"}), currentPage, rowsPerPage}).then(res=>{
        if (res.status==200 && res.obj[0]){
          const data = res.obj[0]["data"];
          console.log("response data",res.obj[0]["data"]);
          if (data && data.length==0){
            setAllData([]);
            return;
          }

          const links:{section:string,index:string|number}[] = [];
          setAllData(data);
          setTotalPages(Math.ceil(Number(res.obj[0]["metadata"][0]["total"])/Number(rowsPerPage)));
          setDocumentLinks(links);

          for (let i=0; i<data.length; i++){
            const deal = data[i];
            
            deal["link"] = <div>
              <p className="text-blue-500 text-base">{deal["DN"]}</p>
              <p className="font-light text-sm">{deal["DC"]}</p>
              <p className="text-xs">{currentSection}</p>
            </div>;

            links.push({section:"../"+getDocSecName({inputName:currentSection,inputType:"fullname",outputType:"shortname"}),index:deal["AID"]});
          }
        }
        else
          setAllData([]);
      })
      setAdded(false);
    }
  },[added]);

  return(
    <div>
			<p className="text-3xl font-bold m-7">{props.label}</p>

      <div className='flex flex-row relative'>
        <div className="mx-7">
          <Filter value={currentSection} setValue={setCurrentSection} options={getDocSecList("fullname")} />
        </div>
      </div>

      {/* <Tabs value={currentSection} scrollButtons allowScrollButtonsMobile onChange={(_,val)=>setCurrentSection(val)} variant="scrollable" textColor="secondary" indicatorColor="secondary">
        {getDocSecList("fullname").map(name=><Tab key={name} label={name} value={name} />)}
      </Tabs> */}

      <div className="m-7">
        {allData
          ?allData.length==0
            ?<EmptyPageMessage sectionName={`${props.label}`} />
            :<DataTable className="rounded-xl bg-white"
              headingRows={["Sr. No.", "Document Name", "Team Name", "Agreement ID", type=="def"?"Default Date":"Priority","Status", "Action"]}
              cellClassName={["w-[50px]","w-[300px]","","","mr-10","","w-[200px]"]}
              tableData={allData} dataTypes={["index","doc-link","text","text",type=="def"?"date":"priority","doc-status","action"]} columnIDs={["link","N","AID",type=="def"?"DD":"DP","DS"]}
              indexStartsAt={(currentPage-1)*rowsPerPage}
              documentLinks={documentLinks}
              action={
                allData.map((doc:any,index:number)=>{
                  const sn = getDocSecName({inputName:currentSection,inputType:"fullname",outputType:"keyname"});
                  if (!doc["DS"] || !doc["FD"] || doc["DS"]==DocumentStatusList[1])
                    return <UploadFileButton key={index} index={index} disabled={!admin && !userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})].includes("add")}
                      AID={doc["AID"]} sectionKeyName={sn}
                      setAdded={setAdded}
                      isPayment={sn=="PD"}
                      docId={sn=="PD"?doc["index"]:doc._fileId} 
                      _id={sn=="PD"?doc._fileId:undefined}
                  />
                  else
                    return <ViewFileButton key={index} type="doc" disabled={!admin && !userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})].includes("view")}
                      AID={doc["AID"]} loanId={doc._loanId} docId={doc._fileId} sectionKeyName={sn} 
                      status={doc["DS"]} rejectionReason={doc["R"]} 
                      setAdded={setAdded} 
                      setIsDeleted={setIsDeleted}
                      actualName={sn=="PD"
                        ?(doc.FD && doc.FD[0] && doc.FD[0].originalname)
                          ?doc.FD[0].originalname
                          :""
                        :doc.FD[0].originalname||""
                      } 
                      fileName={sn=="PD"
                        ?(doc.FD && doc.FD[0] && doc.FD[0].filename)
                          ?doc.FD[0].filename
                          :""
                        :doc.FD[0].filename||""
                      }
                    />
                })
              }
              />
          :<LoadingMessage sectionName="data" />
        }
      </div>

      {allData && allData.length>0
        ?<Pagination className="mx-5" currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
        :<></>
      }
      {toastOptions?<Toast toastOptions={toastOptions} setToastOptions={setToastOptions} />:<></>}
    </div>
  )
}
 
export default SpecialCases;


/* const getDocsLoanData = (docList:FieldValues[],loanDetails:FieldValues[],teamName:string,section:string,arr:FieldValues[],links:{section:string,index:string|number}[]) => {
    for (let j=0; j<docList.length; j++){
      const singleDoc = docList[j];
      const loanId = singleDoc["_loanId"];
      const obj:any ={};
      obj["_id"] = singleDoc["_id"]
      obj["_loanId"] = loanId;
      obj["TN"] = teamName;

      obj["N"] = singleDoc["N"];
      if (singleDoc["R"])
        obj["R"] = singleDoc["R"];

      obj["SN"] = sectionNameToAbbreviation[section];

      if (singleDoc["FD"])
        obj["FD"] = [...singleDoc["FD"]];
      if (singleDoc["GS"]){
      }

      if (section=="payment" && singleDoc["GS"]){
        obj["GS"] = [...singleDoc["GS"]];
        obj["GS"].map((inst:any,index:number)=>{
          if (inst && singleDoc["ND"]==inst["D"]){
            obj["index"]=index;
            obj["S"] = inst["S"]
            obj["DD"] = singleDoc["ND"];
          }
        })
      }
      else{
        obj["P"] = singleDoc["P"];
        obj["S"] = singleDoc["S"];
        obj["DD"] = singleDoc["ED"];
        obj["C"] = singleDoc["C"];
      }

      obj["link"] = <div>
        <p className="text-blue-500 text-base">{obj["N"]}</p>
        <p className="font-light text-sm">{obj["C"]}</p>
        <p className="text-xs">{sectionNameBeautify[section]}</p>
      </div>;

      for (let k=0; k<loanDetails.length; k++){
        if (loanId == loanDetails[k]["_id"]){
          obj["AID"]=loanDetails[k]["AID"];
          obj["CN"] = loanDetails[k]["CN"];
        }     
      }
      arr.push(obj);
      if (section=="payment"){
        links.push({section:"../schedule", index:obj["AID"]});
      }
      else if (section=="covenants")
        links.push({section:"../"+section, index:obj["AID"]});
      else if (section.charAt(section.length-1)=="s")
        links.push({section:"../"+section.slice(0,section.length-1), index:obj["AID"]});
      else
        links.push({section:"../"+section,index:obj["AID"]});
    }
  } */