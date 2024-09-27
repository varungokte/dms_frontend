import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { PermissionContext } from "@/Contexts";
import { constants } from "@/Constants";

import { getDocSecList, getModSecName } from "@/functions/sectionNameAttributes";
import { FieldValues } from "@/types/DataTypes";
import { LoanFormMetaData } from "@/types/ComponentProps";
import { getLoanDetails } from "@/apiFunctions/loanAPIs";

import Tooltip from '@mui/material/Tooltip';
import LoadingMessage from "./BasicMessages/LoadingMessage";
import { Tab, Tabs, Typography } from "@mui/material";

import LoanIDAssignment from "./LoanAccountComponents/LoanIDAssignment";
import LoanBasicDetails from "./LoanAccountComponents/LoanBasicDetails";
import LoanSecurityDetails from "./LoanAccountComponents/LoanSecurityDetails";
import LoanBankDetails from "./LoanAccountComponents/LoanBankDetails";
import LoanRatings from "./LoanAccountComponents/LoanRatings";
import LoanPaymentSchedule from "./LoanAccountComponents/LoanPaymentSchedule";
import LoanContactDetails from "./LoanAccountComponents/LoanContactDetails";
import LoanTeamSelection from "./LoanAccountComponents/LoanTeamSelection";
import LoanDocuments from "./LoanAccountComponents/LoanDocuments";

function CreateLoanAccount() {
  const {state} = useLocation();
	const navigate = useNavigate();

  const {userPermissions} = useContext(PermissionContext);
  const {LoanSecuredList} = constants

  if (!state)
    return <Navigate to="../loan" />
  
  useEffect(()=>{
		document.title=`${(state.linkSource.charAt(0).toUpperCase()+state.linkSource.toLowerCase().slice(1))} Loan Account`+" | Beacon DMS"
	},[]);

  useEffect(()=>{
    if (!state)
      navigate("../loan");
  },[state]);
  
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
    const res = await getLoanDetails(loanId);
    console.log("preexisting data",res)
    if (res.status==200){
      if (res.obj["STV"] && res.obj["STV"].length==0)
        res.obj["STV"]=[{}];
      
      if (res.obj["ST"] && res.obj["ST"]==LoanSecuredList[2])
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

  useEffect(()=>{
    if (actionType=="EDIT" || actionType=="VIEW")
      getOldData();
  },[]);

  useEffect(()=>{
    if (currentSection>0 && currentSection<5 && changesHaveBeenMade){
      getOldData().then(()=>{
        setChangesHaveBeenMade(false);
      });
    }
  },[changesHaveBeenMade]);

  const goToPreviousSection = () => {
    if (currentSection<2)
      return;
    for (let i=currentSection-1; i>=1; i--){
      const disabled = tabIsDisabled(i).disabled;
      //console.log("curr section",i,disabled)
      if (!disabled){
        setCurrentSection(i);
        break;
      }
    }
  }

  const goToNextSection = (conditions?:LoanFormMetaData) => {
    console.log("next section conditions",conditions)
    if (conditions){
      if (conditions.okToFrolic)
        setOkToFrolic(conditions.okToFrolic);
      if (conditions.AID)
        setAID(conditions.AID);
      if (conditions.loanId)
        setLoanId(conditions.loanId);
      if(conditions.changesHaveBeenMade)
        setChangesHaveBeenMade(conditions.changesHaveBeenMade);
      if (conditions.enableDocumentSections)
        setEnableDocumentSections(conditions.enableDocumentSections);
    }
    const sectionCount = formSections.length-1;
    if (currentSection==sectionCount)
      return;
    for (let i=currentSection+1; i<=sectionCount; i++){
      const disabled = tabIsDisabled(i,conditions).disabled;
      if (!disabled){
        setCurrentSection(i);
        break;
      }
    }
  };

  const tabIsDisabled =(index:number,conditions?:LoanFormMetaData) => {
    if (userPermissions){
      const sectionName = formSections[index].name;
      const sectionPermissions = userPermissions[getModSecName({inputName:sectionName, inputType:"fullname", outputType:"shortname"})];
      const documentSections = getDocSecList("fullname");
      if (documentSections.includes(sectionName) && sectionPermissions && sectionPermissions["docs"] && !sectionPermissions["docs"].includes("access"))
        return {disabled:true, reason:""}
      else if (!documentSections.includes(sectionName) && sectionPermissions && !sectionPermissions.includes("access"))
        return {disabled:true, reason:""}
    }

    const localOkToFrolic = conditions&&conditions.okToFrolic?conditions.okToFrolic:okToFrolic;
    const localEnableDocumentSections = conditions&&conditions.enableDocumentSections?conditions.enableDocumentSections:enableDocumentSections;

    if (currentSection==0 && !localOkToFrolic)
      return {disabled:true,reason:""};
    else if (index==0)
      return {disabled:true,reason:""};
    else if (!localOkToFrolic && index!=1)
      return {disabled:true, reason:"Fill all required details before moving to this page"};
    else if (!localEnableDocumentSections && index>=7)  
      return {disabled:true, reason:"Select a team to access this section"};
    else
      return {disabled:false,reason:""};
  }

  return(
    <div style={{width:"relative"}}>
			<p className="text-3xl font-bold mx-7 my-2 page-heading">{(actionType.charAt(0).toUpperCase()+actionType.toLowerCase().slice(1))} Loan Account</p>
      {AID?<p className="mx-7 mt-3 text-lg"><span className="font-normal">Agreement ID: </span><span className="text-custom-1">{AID}</span></p>:""}
      <br/>
      <div className="bg-white mx-7 p-2 rounded-xl">
      <Tabs
        TabIndicatorProps={{style:{display:"none"}}}
        value={currentSection}
        onChange={(_,val)=>{ 
          if (tabIsDisabled(val).disabled)
            return; 
          else
            setCurrentSection(val)
        }}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
      >
        {formSections.map((section, index:number)=>{
          let boxStyling="";
          let numberStyling="";
          let textStyling="";

          const isDisabled = tabIsDisabled(index);
          const disabled = isDisabled.disabled;
          const disabledReason = isDisabled.reason;
          
          if (disabled){
            textStyling = "text-slate-400";
            numberStyling = "border-slate-300 text-slate-300";
          }
          else {
            textStyling = "text-slate-700";
            numberStyling = "border-slate-700"
          }

          if (currentSection==index){
            boxStyling = "bg-custom-1 text-white";
            textStyling = "text-white";
            numberStyling = "border-white";
          }
        
          return (
            <Tab key={index} disableRipple={true} sx={{cursor:disabled?"default":""}}
              label={
                <Tooltip key={index} title={disabledReason==""?"":<Typography>{disabledReason}</Typography>} placement="top" arrow >
                  <div className={`flex flex-row py-3 px-2 border-2 border-zinc-300 rounded-xl min-w-44 ${boxStyling}`}>
                    <div className={`border rounded-full ${numberStyling}`} style={{ height:"30px", width:"30px", lineHeight:"30px", fontSize:"12px"}}>
                      {`${index+1}.`}
                    </div>
                    <div className={`m-auto ${textStyling}`}>
                      <Typography textTransform="capitalize">{section.name}</Typography>
                    </div>
                  </div>
                </Tooltip>
              }
              onClick={()=>{
                if (disabled)
                  return;
                else if (unsavedWarning)
                  confirm("WARNING:\nYour unsaved data will be lost.\nTo save your data, close this dialog and click \"Save & Next\"")
                    ?setCurrentSection(index)
                    :setCurrentSection(currentSection)
                else
                  setCurrentSection(index)                      
              }}
            />
          )
        })}
      </Tabs>

        <div className="mx-10">
          {dataHasLoaded
            ?React.createElement (formSections[currentSection].component, 
              {
                key:currentSection,
                actionType: actionType,
                loanId: loanId,
                AID: AID,
                currentSection: currentSection,
                goToPreviousSection: goToPreviousSection,
                goToNextSection: goToNextSection,
                setUnsavedWarning: setUnsavedWarning,
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