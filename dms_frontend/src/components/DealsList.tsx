import { ReactElement, useEffect, useRef, useState } from "react";
import useGlobalContext from "../../GlobalContext";
import moment from "moment";
import { DocumentStatus, DocumentSectionDetails } from "DataTypes";

import SingleDealDocuments from "./SingleDealDocuments";
import SingleDealPayments from "./SingleDealPayments";

import TableCollapsible from "./BasicComponents/TableCollapsible";
import Search from "./BasicComponents/Search";
import ProgressBar from "./BasicComponents/ProgressBar";
import EmptyPageMessage from "./BasicComponents/EmptyPageMessage";
import LoadingMessage from "./BasicComponents/LoadingMessage";
import { useLocation } from "react-router-dom";
import { Pagination } from "./BasicComponents/Pagination";

type DocumentDetails= {
  _id:string,
  AID:string, 
  CN:string, 
  SD:Date|string,
  details: {S:DocumentStatus}[]
}

function DealsList(props:{label:string}) {
  useEffect(()=>{
		document.title=props.label+" | Beacon DMS"
	},[]);

  const {state} = useLocation();
  const dealRefs = useRef<any>([]);

  useEffect(()=>console.log("state",state),[state])

  const setSection = (): DocumentSectionDetails => {
    if (props.label=="Transaction Documents")
      return { sectionName: "TD", sectionType:"doc" }
    else if (props.label=="Compliance Documents")
      return { sectionName: "CD", sectionType:"doc" }
    else if (props.label=="Covenants")
      return { sectionName: "C", sectionType:"cov" }
    else if (props.label=="Condition Precedent")
      return { sectionName: "CP", sectionType:"con" }
    else if (props.label=="Condition Subsequent")
      return { sectionName: "CS", sectionType:"con" }
    else
      return { sectionName:"PD", sectionType:"pay" }
  }

  const [sectionDetails] = useState(setSection());

  const [dealData, setDealData] = useState<DocumentDetails[]>();

  const [calculate, setCalculate] = useState(true);
  const [searchString, setSearchString] = useState("");
  const [showDeals, setShowDeals] = useState<boolean[]>();
  const [fromRedirect, setFromRedirect] = useState(true);
  const [currentTab, setCurrentTab] = useState(-1);

  const { getDealList} = useGlobalContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(()=>{
    setCalculate(true);
  },[currentPage,rowsPerPage]);

  useEffect(()=>{
    if (calculate){
      getDealList({sectionName:sectionDetails.sectionName, currentPage, rowsPerPage}).then(res=>{
        try{
          setDealData(res.obj[0]["data"]);
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
      });
      setCalculate(false);
    }
  },[calculate]);

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

  return(
    <div>
			<p className="text-3xl font-bold m-7">{props.label}</p>
			<div className="flex flex-row">
        <div className='mx-10'>
          <Search setter={setSearchString} label="Search"/>
        </div>
      </div>

      <div className="bg-white m-10 rounded-xl">
        <br/>
        {dealData==undefined
          ?<LoadingMessage sectionName="data" />
          :dealData.length==0
            ?<EmptyPageMessage sectionName="deals"/>
            :dealData.map((deal,index)=>{
                return <div ref={el=>dealRefs.current[index]=el} key={index}>
                  <SingleDealDetails key={index} label={props.label} index={index} deal={deal} sectionDetails={sectionDetails} searchString={searchString} showDeals={showDeals||[]} setShowDeals={setShowDeals} calculate={calculate} setCalculate={setCalculate} linkSource={state} setCurrentTab={setCurrentTab} />
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

function SingleDealDetails(props:{index:number, label:string, deal:DocumentDetails, sectionDetails:DocumentSectionDetails, searchString:string, showDeals:boolean[],setShowDeals:Function, calculate:boolean, setCalculate:Function, linkSource?:string,setCurrentTab:Function}) {
  const [added,setAdded] = useState(true);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(()=>{
    if (added){
      props.setCalculate(true);
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
  },[props.deal,props.calculate]);

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

  if (props.sectionDetails.sectionType!="pay"){
    tableTopRow.push(["Verified Documents", "w-[26.70%] font-medium text-base text-justify"])
    tableBottomRow.push([<ProgressBar value={progressValue} />, "content-center"])
  }

  return(
    <TableCollapsible key={props.index} index={props.index}
      topRow={tableTopRow}
      bottomRow={tableBottomRow}
      showTabs={props.showDeals} setShowTabs={props.setShowDeals}
      content={props.sectionDetails.sectionType=="pay"
        ?<SingleDealPayments label={props.label} loanId={props.deal["_id"]} AID={props.deal.AID} sectionDetails={props.sectionDetails} />
        :<SingleDealDocuments label={props.label} loanId={props.deal["_id"]} AID={props.deal.AID} sectionDetails={props.sectionDetails} added={added} setAdded={setAdded} open={props.showDeals[props.index]}/>
      }
      searchString={props.searchString}
    />
  )
}

export default DealsList;