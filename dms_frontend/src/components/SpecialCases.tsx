import { useEffect, useState } from "react";
import { DocumentStatusList } from "../../Constants";
import useGlobalContext from "../../GlobalContext";
import { FieldValues } from "../../DataTypes";

import Search from "./BasicComponents/Search";
import { DataTable } from "./BasicComponents/Table";

import LoadingMessage from "./BasicComponents/LoadingMessage";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";

import UploadFileButton from "./BasicComponents/UploadFileButton";
import ViewFileButton from "./BasicComponents/ViewFileButton";

function SpecialCases(props:{label:string}) {
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);
  
  const [defaultData, setDefaultData] = useState<FieldValues[]>();
  const [type] = useState<"def"|"crit">(props.label=="Default Cases"?"def":"crit");

  const [searchString, setSearchString] = useState("");
  const [added, setAdded] = useState(true);
  const [documentLinks,setDocumentLinks] = useState<string[]>([]);

  const {getSpecialList} = useGlobalContext();

  const sectionNameBeautify:{[key:string]:string} = {
    "transactions": "Transaction Documents",
    "compliance": "Compliance Documents",
    "covenants": "Covenants",
    "precedents": "Condition Precedent",
    "subsequents": "Condition Subsequent",
    "payment": "Payment"
  }

  const sectionNameToAbbreviation:{[key:string]:string} = {
    "transactions":"TD",
    "compliance":"CD",
    "covenants":"C",
    "precedents":"CP",
    "subsequents":"CS",
    "payment": "PD"
  }

  const getDocsLoanData = (docList:FieldValues[],loanDetails:FieldValues[],teamName:string,section:string,arr:FieldValues[],links:string[]) => {
    for (let j=0; j<docList.length; j++){
      const singleDoc = docList[j];
      const loanId = singleDoc["_loanId"];
      const obj:any ={};
      obj["_id"] = singleDoc["_id"]
      obj["_loanId"] = loanId;
      obj["TN"] = teamName;
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
        <p className="text-blue-500 text-base">{sectionNameBeautify[section]}</p>
        <p className="font-light">{obj["C"]}</p>
      </div>;

      for (let k=0; k<loanDetails.length; k++){
        if (loanId == loanDetails[k]["_id"]){
          obj["AID"]=loanDetails[k]["AID"];
          obj["CN"] = loanDetails[k]["CN"];
        }     
      }
      arr.push(obj);
      if (section=="payment"){
        console.log("the section",section)
        links.push("../schedule");
      }
      else if (section=="covenants")
        links.push("../"+section);
      else if (section.charAt(section.length-1)=="s")
        links.push("../"+section.slice(0,section.length-1));
      else
        links.push("../"+section);
    }
  }

  useEffect(()=>{
    if (added){
      getSpecialList(type).then(res=>{
        console.log("response",res);
        if (res.status==200){
          const arr:any = [];
          const data = res.obj;
          const links:string[] = [];
          for (let i=0; i<data.length; i++){
            const teamName = data[i]["N"];
            const loanDetails = data[i]["loanDetails"];
            const sections = ["transactions","compliance","covenants","precedents","subsequents","payment"]
            for (let j=0; j<sections.length; j++){
              const section = sections[j];
              let docs = data[i][section];
              if (section=="payment" && docs)
                docs = [data[i][section]];
              
              if (docs)
                getDocsLoanData(docs,loanDetails,teamName,section,arr,links)
            }   
          }
          console.log("The result", arr);
          setDefaultData(arr);
          setDocumentLinks(links);
        }
        else
          setDefaultData([]);
      })
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
              headingRows={["Sr. No.", "Document Name", "Team Name", "Agreement ID","Status", type=="def"?"Default Date":"Priority", "Action"]}
              cellClassName={["w-[50px]","w-[300px]","","","","mr-10","w-[200px]"]}
              tableData={defaultData} dataTypes={["index","doc-link","text","text","doc-status",type=="def"?"date":"priority","action"]} columnIDs={["link","TN","AID","S",type=="def"?"DD":"P"]}
              searchRows={searchString==""?[]:[searchString,0]} filterRows={[]} 
              documentLinks={documentLinks}
              action={
                defaultData.map((doc:any,index:number)=>{
                  if (doc["GS"])
                    console.log("single doc",doc);
                  if (!doc["S"] || doc["S"]==DocumentStatusList[1])
                    return <UploadFileButton key={index} index={index} 
                      AID={doc["AID"]} sectionName={doc["SN"]}
                      setAdded={setAdded}
                      isPayment={doc["SN"]=="PD"}
                      docId={doc["SN"]=="PD"?doc["index"]:doc._id} 
                      _id={doc["SN"]=="PD"?doc._id:undefined}
                  />
                  else
                    return <ViewFileButton key={index} type="doc" 
                      AID={doc["AID"]} loanId={doc._loanId} docId={doc._id} sectionName={doc["SN"]} 
                      status={doc["S"]} rejectionReason={doc["R"]} 
                      setAdded={setAdded} 
                      actualName={doc["SN"]=="PD"
                        ?(doc.FD && doc.FD[0] && doc.FD[0].originalname)?doc.FD[0].originalname:""
                        :doc.FD[0].originalname||""} 
                      fileName={doc["SN"]=="PD"
                        ?(doc.FD && doc.FD[0] && doc.FD[0].filename)?doc.FD[0].filename:""
                        :doc.FD[0].filename||""
                      }
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
 
export default SpecialCases;