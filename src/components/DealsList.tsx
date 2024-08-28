import { ReactElement, useEffect, useRef, useState } from "react";
import useGlobalContext from "../functions/GlobalContext";
import moment from "moment";
import { DocumentStatus, FieldValues, SetStateBoolean } from "@/types/DataTypes";
import {DocumentSectionDetails, DocumentSectionKeys, DocumentSectionTypes, getDocSecName} from "@/functions/DocumentSectionAttributes";

import SingleDealDocuments from "./SingleDealDocuments";
import SingleDealPayments from "./SingleDealPayments";

import TableCollapsible from "./BasicTables/TableCollapsible";
import ProgressBar from "./BasicComponents/ProgressBar";
import EmptyPageMessage from "./BasicMessages/EmptyPageMessage";
import LoadingMessage from "./BasicMessages/LoadingMessage";
import { useLocation } from "react-router-dom";
import { Pagination } from "./BasicComponents/Pagination";
import { panopticSectionNames, sectionNames } from "../functions/Constants";
//import Filter from "./BasicComponents/Filter";

type DocumentDetails= {
  _id:string,
  AID:string, 
  CN:string,
  SD:Date|string,
  details: {S:DocumentStatus}[]
}

function DealsList(props:{label:string, specType?:"assign"|"masters", docData?:FieldValues, panopticPage?:boolean}) {
  useEffect(()=>{
    if (!props.specType || props.specType=="masters")
		  document.title=props.label+" | Beacon DMS"
	},[]);

  const {state} = useLocation();
  const dealRefs = useRef<any>([]);

  const admin = props.panopticPage||false;

  const setSection = (): DocumentSectionDetails => {
    const label = props.panopticPage?panopticSectionNames[props.label]:sectionNames[props.label];
    return {
      sectionKeyName:getDocSecName(label,"shortname","keyname") as DocumentSectionKeys, 
      sectionType:getDocSecName(label,"shortname","type") as DocumentSectionTypes
    };
  }

  const sectionDetails = setSection();

  const [dealData, setDealData] = useState<DocumentDetails[]>();

  const [addedDeals, setAddedDeals] = useState(false);

  const [showDeals, setShowDeals] = useState<boolean[]>();
  const [fromRedirect, setFromRedirect] = useState(true);
  const [currentTab, setCurrentTab] = useState(-1);

  const { getDealList} = useGlobalContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //const [teamRole, setTeamRole] = useState("Maker");

  useEffect(()=>{
    //console.log("props.docData",props.docData,"oldCalculate",calculate)
    if (props.docData)
      setAddedDeals(true)
  },[props.docData]);

  useEffect(()=>{
    setAddedDeals(true);
  },[currentPage,rowsPerPage]);

  const getDocData = async () => {
    const res =props.specType&&props.specType=="assign"?(props.docData):await getDealList({ admin,sectionName:sectionDetails.sectionKeyName, teamRole:"teamRole", currentPage, rowsPerPage});
    //console.log("response",res);
    if (!res)
      return;

    try{
      setDealData(res.obj[0]["data"]);
      //console.log("response data",res.obj[0]["data"])
      const arr = new Array(res.obj.length).fill(false);
      if (currentTab!=-1)
        arr[currentTab] = true;
      setShowDeals(arr);
      setCurrentTab(-1);
      setTotalPages(Math.ceil(Number(res.obj[0]["metadata"][0]["total"])/Number(rowsPerPage)));
    }
    catch(e){
      setDealData([]);
    }
    setAddedDeals(false);
    return res;
  }

  useEffect(()=>{
    if (addedDeals)
      getDocData();
  },[addedDeals]);

  useEffect(()=>{
    if (!state)
      setFromRedirect(false);
    else if (fromRedirect)
      openDeal();
  },[state,dealData]);

  const openDeal = () =>{
    if (!dealData || !showDeals)
      return;

    let dealIndex = -1;
    dealData.map((deal,index)=>{if (deal.AID==state)dealIndex=index});
    if (dealIndex)
      setShowDeals((curr:boolean[]|undefined)=>{
        if (!curr)
          return;
        curr[dealIndex] = true;
        return [...curr];
    })
  }

  //useEffect(()=>console.log("calculate",calculate),[calculate]);

  return(
    <div>
      {props.specType=="assign"?<></>:<p className="text-3xl font-bold m-7">{props.label}</p>}
			<div className="flex flex-row mx-7">
        {/* <div>
          <Filter value={teamRole} setValue={setTeamRole} options={["Maker","Checker"]} />
        </div> */}
      </div>

      <div className="bg-white m-7 rounded-xl">
        <br/>
        {dealData==undefined
          ?<LoadingMessage sectionName="data" />
          :dealData.length==0
            ?<EmptyPageMessage sectionName="deals"/>
            :dealData.map((deal,index)=>{
              return <div ref={el=>dealRefs.current[index]=el} key={index}>
                <SingleDealDetails key={index} label={props.label} index={index} deal={deal} sectionDetails={sectionDetails} showDeals={showDeals||[]} setShowDeals={setShowDeals} addedDeals={addedDeals} setAddedDeals={setAddedDeals} linkSource={state} setCurrentTab={setCurrentTab} admin={admin} teamRole={"teamRole"} />
              </div>
            })
        }
        <br/>
        {dealData && dealData.length>0
          ?<Pagination className="mx-5" currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
          :<></>
        }
      </div>
    </div>
  )
}

function SingleDealDetails(props:{index:number, label:string, deal:DocumentDetails, sectionDetails:DocumentSectionDetails, showDeals:boolean[],setShowDeals:React.Dispatch<React.SetStateAction<boolean[]|undefined>>, addedDeals:boolean, setAddedDeals:SetStateBoolean, linkSource?:string,setCurrentTab: React.Dispatch<React.SetStateAction<number>>, admin:boolean, teamRole:string}) {
  const [added,setAdded] = useState(true);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(()=>{
    if (added && props.showDeals[props.index]){
      console.log("ENTERED")
      props.setAddedDeals(true);
      if (props.showDeals[props.index])
        props.setCurrentTab(props.index);
    }
  },[added]);

  useEffect(()=>{
    const totalDocs = props.deal.details.length;
    let verifiedDocs = 0;
    for (let i=0; i<totalDocs; i++){
      if (props.deal.details[i]["S"]=="Verified")
        verifiedDocs++;
    }
    const percentage = (verifiedDocs/totalDocs*100).toFixed(2);
    setProgressValue(Number(percentage));
  },[props.deal,props.addedDeals]);

  const tableTopRow:[string,string][] = [
    [props.deal.AID, "w-[20%] font-medium text-base"],
    [props.deal.CN, "w-[20%] font-medium text-base"], 
    [moment(props.deal.SD).format("DD-MM-yyyy"), "w-[30%] font-medium text-base"],
  ];

  const tableBottomRow:[string|ReactElement,string][] = [
    ["Agreement ID", "font-light"], 
    ["Company Name", "font-light"],
    ["Sanction Date", "font-light"],
  ];

  if (props.sectionDetails.sectionType!="payment"){
    tableTopRow.push(["Verified Documents", "w-[26.70%] font-medium text-base text-justify"])
    tableBottomRow.push([<ProgressBar value={progressValue} />, "content-center"])
  }

  return(
    <TableCollapsible key={props.index} index={props.index}
      topRow={tableTopRow}
      bottomRow={tableBottomRow}
      showTabs={props.showDeals} setShowTabs={props.setShowDeals}
      content={props.sectionDetails.sectionType=="payment"
        ?<SingleDealPayments label={props.label} loanId={props.deal["_id"]} AID={props.deal.AID} sectionDetails={props.sectionDetails} admin={props.admin} />
        :<SingleDealDocuments label={props.label} loanId={props.deal["_id"]} AID={props.deal.AID} sectionDetails={props.sectionDetails} added={added} setAdded={setAdded} admin={props.admin} teamRole={props.teamRole} />
      }
    />
  )
}

export default DealsList;