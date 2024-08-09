import React, { useEffect, useState } from "react";
import useGlobalContext from "./../../GlobalContext";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LoanSecurityTypeList } from "./../../Constants";

import LoadingMessage from "./BasicMessages/LoadingMessage";

import LoanIDAssignment from "./LoanAccountComponents/LoanIDAssignment";
import LoanBasicDetails from "./LoanAccountComponents/LoanBasicDetails";
import LoanSecurityDetails from "./LoanAccountComponents/LoanSecurityDetails";
import LoanBankDetails from "./LoanAccountComponents/LoanBankDetails";
import LoanRatings from "./LoanAccountComponents/LoanRatings";
import LoanPaymentSchedule from "./LoanAccountComponents/LoanPaymentSchedule";
import LoanContactDetails from "./LoanAccountComponents/LoanContactDetails";
import LoanTeamSelection from "./LoanAccountComponents/LoanTeamSelection";
import LoanDocuments from "./LoanAccountComponents/LoanDocuments";

//import Tooltip from '@mui/material/Tooltip';
import { Tab, Tabs, Typography } from "@mui/material";
import { FieldValues } from "DataTypes";

function CreateLoanAccount() {
  const {state} = useLocation();
	const navigate = useNavigate();

  if (!state)
    return <Navigate to="../loan" />
  
  useEffect(()=>{
		document.title=`${(state.linkSource.charAt(0).toUpperCase()+state.linkSource.toLowerCase().slice(1))} Loan Account`+" | Beacon DMS"
	},[]);

  useEffect(()=>{
    if (!state)
      navigate("../loan");
  },[state])

  const {getLoanFields} = useGlobalContext();
  
  const actionType:"CREATE"|"EDIT"|"VIEW" =state.linkSource;

  const [loanId, setLoanId] = useState(state.linkSource=="CREATE"?"":state.loanId);
  const [AID, setAID] = useState(state.linkSource=="CREATE"?"":state.AID);
  const [currentSection, setCurrentSection] = useState(state.linkSource=="CREATE"?0:1);

  const [preexistingData, setPreexistingData] = useState<FieldValues>();
  
  const [okToFrolic, setOkToFrolic] = useState(state.linkSource=="CREATE"?false:true); //When false, user cannot go to other pages
  const [unsavedWarning, setUnsavedWarning] = useState(false); //when true, user will get a pop-up warning beacuse changes have been made
  const [changesHaveBeenMade, setChangesHaveBeenMade] = useState(false);
  const [enableDocumentSections, setEnableDocumentSections] = useState(false);
  
  const [showSecurityDetails, setShowSecurityDetails] = useState(true);
  const [dataHasLoaded, setDataHasLoaded] = useState(state.linkSource=="CREATE"?true:false);

  const [assignedTeam,setAssignedTeam] = useState<string>();

  const formSections = [
    { name: "Create Agreement ID", component: LoanIDAssignment },
    { name: "Basic Details", component: LoanBasicDetails },
    { name: "Security Details", component: LoanSecurityDetails },
    { name: "Bank Details", component: LoanBankDetails },
    { name: "Ratings", component: LoanRatings },
    { name: "Contact Details", component: LoanContactDetails },
    { name: "Select Team", component: LoanTeamSelection },
    { name: "Payment Schedule", component: LoanPaymentSchedule },
    { name: "Transaction Documents", component: LoanDocuments },
    { name: "Compliance Documents", component: LoanDocuments },
    { name: "Covenants", component: LoanDocuments },
    { name: "Condition Precedent", component: LoanDocuments },
    { name: "Condition Subsequent", component: LoanDocuments },
  ];

  const getOldData = async () => {
    const res = await getLoanFields(loanId);
    console.log("preexisting data",res)
    if (res.status==200){
      if (res.obj["STV"] && res.obj["STV"].length==0)
        res.obj["STV"]=[{}];
      if (res.obj["ST"] && res.obj["ST"]==LoanSecurityTypeList[2])
        setShowSecurityDetails(false);
      if (res.obj["CN"])
        setPreexistingData(res.obj);
      if (res.obj["_teamId"]){
        setAssignedTeam(res.obj["_teamId"]);
        setEnableDocumentSections(true);
      }
      setDataHasLoaded(true);
    }
  }

  /* const getAssignedTeam = async() => {
    if (loanId){
      const res = await getTeamsList(loanId);
      if (res.status==200 && res.obj && res.obj.currentTeam && Object.keys(res.obj.currentTeam).length!=0){
        setEnableDocumentSections(true);
        setAssignedTeam(res.obj.currentTeam._teamId);
        setTeamList(res.obj.list);
      }
      else
        setEnableDocumentSections(false);
    }
    else
      setEnableDocumentSections(false);
  } */

  useEffect(()=>{
    if (actionType=="EDIT" || actionType=="VIEW"){
      getOldData();
      //getAssignedTeam();
    }
  },[]);
  
  /* useEffect(()=>{
    if (actionType=="CREATE" && currentSection>0 && currentSection<5)
      getOldData();
  },[currentSection]) */

  useEffect(()=>{
    if (currentSection>0 && currentSection<5 && changesHaveBeenMade){
      getOldData().then(()=>{
        setChangesHaveBeenMade(false);
      });
    }
  },[changesHaveBeenMade])

  const goToNextSection = async () => {
    const sectionCount = formSections.length-1;
    setCurrentSection((curr)=>{
      if (curr===sectionCount) return sectionCount 
      else return curr+1
    });
  };

  return(
    <div style={{width:"relative"}}>
			<p className="text-3xl font-bold mx-7 my-2 page-heading">{(actionType.charAt(0).toUpperCase()+actionType.toLowerCase().slice(1))} Loan Account</p>
      {AID?<p className="mx-7 mt-3 text-lg"><span className="font-normal">Agreement ID: </span><span className="text-custom-1">{AID}</span></p>:""}
      <br/>
      <div className="bg-white mx-7 p-2 rounded-xl">
      <Tabs
        TabIndicatorProps={{style:{display:"none"}}}
        value={currentSection}
        onChange={(_,val)=>setCurrentSection(val)}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        aria-label="scrollable force tabs example"
      >
        {formSections.map((section, index:number)=>{
          let boxStyling="";
          let numberStyling="";
          let textStyling="";

          const disabled = !okToFrolic || index==0 || (!enableDocumentSections && index>=7);

          if (currentSection==index){
            boxStyling = "bg-custom-1 text-white";
            numberStyling = "border-white";
          }
          else if (!disabled){
            textStyling = "text-slate-700";
            numberStyling = "border-slate-700"
          }
          //outside div: ${currentSection===index?"bg-custom-1 text-white":index===0?"text-slate-400 border-zinc-200":"text-slate-700"}
          //number : ${currentSection===index?"border-white":"text-zinc-700 border-zinc-500"}
          //text: ${currentSection==0 && currentSection!==index?"text-zinc-500":""}

          return (
            //<Tooltip key={index} title="A" placement="top">
            <Tab key={index} disableRipple={false} disableFocusRipple={false}
              label={
                <div className={`flex flex-row py-3 px-2 border-2 border-zinc-300 rounded-xl min-w-44 ${boxStyling}`}>
                  <div className={`border rounded-full ${numberStyling}`} style={{ height:"30px", width:"30px", lineHeight:"30px", fontSize:"12px"}}>
                    {`${index+1}.`}
                  </div>
                  <div className={`m-auto ${textStyling}`}>
                    <Typography textTransform="capitalize">{section.name}</Typography>
                  </div>
                </div>
              }
              disabled={disabled}
              onClick={()=>{
                unsavedWarning
                  ?(confirm("WARNING:\nYour unsaved data will be lost.\nTo save your data, close this dialog and click \"Save & Next\"")
                    ?setCurrentSection(index)
                    :setCurrentSection(currentSection)
                  )
                  :setCurrentSection(index)                      
              }}
            />
            //</Tooltip>
          )
            {/* {!okToFrolic && currentSection==1 && index>1
              ?<TooltipContent className="bg-white">
                <p className="">Please fill all <span className="font-bold">required fields</span> to move to this page</p>
              </TooltipContent>
              
              :!enableDocumentSections && currentSection!=0 && index>=7
                ?<TooltipContent className="bg-white">
                  <p className="">Please <span className="font-bold">select a team</span> to move to this page</p>
                </TooltipContent>
                :<></>
            } */}
        })}
      </Tabs>

        <div className="mx-10">
          {dataHasLoaded
            ?React.createElement (formSections[currentSection].component, 
              {
                key:currentSection,
                actionType: actionType,
                loanId: loanId,
                setLoanId: setLoanId,
                AID: AID,
                setAID: setAID,
                currentSection: currentSection,
                setCurrentSection: setCurrentSection,
                goToNextSection: goToNextSection,
                setUnsavedWarning: setUnsavedWarning,
                setChangesHaveBeenMade:setChangesHaveBeenMade,
                setEnableDocumentSections:setEnableDocumentSections,
                label: formSections[currentSection].name,
                setShowSecurityDetails: (formSections[currentSection].name=="Basic Details")?setShowSecurityDetails:()=>{},
                showSecurityDetails: (formSections[currentSection].name=="Security Details")?showSecurityDetails:false,
                setOkToFrolic: currentSection<2?setOkToFrolic:()=>{},
                preexistingValues: preexistingData||{},
                assignedTeam:assignedTeam||"",
                sectionCount:formSections.length-1
              }
            )
            :<LoadingMessage sectionName="details" />
          } 
        </div>
      </div>
      {/* <button onClick={()=>{
        setOkToFrolic(true);
        setCurrentSection(2);}}>Skip
      </button> */}
    </div>
  )
}

export default CreateLoanAccount;