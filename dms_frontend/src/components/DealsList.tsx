import { ReactElement, useEffect, useState } from "react";
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
  
  const [dealData, setDealData] = useState<DocumentDetails[]>();
  const [showDeals, setShowDeals] = useState<boolean[]>();
  const [calculate, setCalculate] = useState(true);

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

  const [searchString, setSearchString] = useState("");

  const { getDealList} = useGlobalContext();

  useEffect(()=>{
    console.log("calculate",calculate)
    if (calculate){
      console.log("get datass")
      getDealList(sectionDetails.sectionName).then(res=>{
        console.log("response",res)
        setDealData(res.obj);
        setShowDeals(new Array(res.obj.length).fill(false));
      });
    }
  },[calculate]);

  useEffect(()=>{
    console.log("deal data has been changed");
    setCalculate(true);
  },[dealData])

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
                return <SingleDealDetails key={index} index={index} deal={deal} sectionDetails={sectionDetails} searchString={searchString} showDeals={showDeals||[]} setShowDeals={setShowDeals} calculate={calculate} setCalculate={setCalculate} />
            })
        }
        <br/>
      </div>
    </div>
  )
}

function SingleDealDetails(props:{index:number, deal:DocumentDetails, sectionDetails:DocumentSectionDetails, searchString:string, showDeals:boolean[],setShowDeals:Function, calculate:boolean, setCalculate:Function}) {
  const [added,setAdded] = useState(true);
  const [progressValue, setProgressValue] = useState(0);

  /* useEffect(()=>{
    console.log("props.deal has changed",props.deal);
    props.setCalculate(true)
  },[props.deal]) */

  useEffect(()=>{
    console.log("inside added",added)
    if (added){
      console.log("setcalculate")
      props.setCalculate(true);
    }
  },[added])

  useEffect(()=>{
    if (!props.calculate)
      return;

    const totalDocs = props.deal.details.length;
    let verifiedDocs = 0;
    for (let i=0; i<totalDocs; i++){
      if (props.deal.details[i]["S"]=="Verified")
        verifiedDocs++;
    }
    const percentage = (verifiedDocs/totalDocs*100).toFixed(2);
    //console.log("percentage calculated",percentage)
    setProgressValue(Number(percentage));
    props.setCalculate(false);
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
      showDeals={props.showDeals} setShowDeals={props.setShowDeals}
      content={props.sectionDetails.sectionType=="pay"
        ?<SingleDealPayments loanId={props.deal["_id"]} AID={props.deal.AID} sectionDetails={props.sectionDetails} />
        :<SingleDealDocuments loanId={props.deal["_id"]} AID={props.deal.AID} sectionDetails={props.sectionDetails} added={added} setAdded={setAdded} />
      }
      searchString={props.searchString}
    />
  )
}

export default DealsList;