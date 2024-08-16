import { useContext, useEffect, useState } from "react";
import useGlobalContext from "../../GlobalContext";
import { DocumentSectionDetails } from "./../DocumentSectionAttributes";
import { DocumentStatusList, panopticSectionNames, sectionNames } from "../../Constants";

import { DataTable } from "./BasicComponents/Table";
import UploadFileButton from "./Buttons/UploadFileButton";
import ViewFileButton from "./Buttons/ViewFileButton";
import EmptyPageMessage from "./BasicMessages/EmptyPageMessage";
import LoadingMessage from "./BasicMessages/LoadingMessage";
import { PermissionContext } from "@/MenuRouter";
import { Pagination } from "./BasicComponents/Pagination";
import Toast from "./BasicComponents/Toast";
import { ToastOptionsAttributes } from "DataTypes";

function SingleDealPayments(props:{label:string, loanId:string, AID:string, sectionDetails:DocumentSectionDetails, admin:boolean}){
  const [paymentData, setPaymentData] = useState<any>();
  const [added, setAdded] = useState(true);
  const [scheduleId, setScheduleId] = useState("");
  const [isDeleted, setIsDeleted] = useState<number>();
  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();
  
  const {getPaymentSchedule} = useGlobalContext();
  const {userPermissions} = useContext(PermissionContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    if (added)
      getPaymentSchedule(props.loanId).then(res=>{
        setAdded(false);
        if (res.status==200){
          console.log("response",res)
          const data = res.obj[0]["data"][0];
          setScheduleId(data["_id"]);
          if (data["T"]=="Fixed")
            data["GS"].map((inst:any)=>{inst["I"]=data["I"]});
          setPaymentData(data["GS"]);
          setTotalPages(Math.ceil(Number(res.obj[0]["metadata"][0]["total"])/Number(rowsPerPage)));
        }
        else
          setPaymentData([]);
      }).catch(()=>{
        setPaymentData([]);
      })
  },[added]);

  useEffect(()=>console.log("payment data",paymentData),[paymentData]);

  useEffect(()=>{
    setAdded(true);
  },[currentPage,rowsPerPage]);

  return (
    <div className="p-5 mx-3 my-2 ">
      <br />
      {paymentData
        ?paymentData.length==0
          ?<EmptyPageMessage sectionName="installments" />
          :<DataTable 
            headingRows={["Installment Number", "Installment Date", "Interest Rate(%)", "Status", "Action"]} headingClassNames={["w-[100px]","","",""," w-[200px]"]}
            tableData={paymentData} columnIDs={["D","I","S"]} dataTypes={["index","date","text","doc-status","action"]}
            cellClassName={["w-[100px]","","","w-[200px]"]} 
            action={
              paymentData.map((inst:any,index:number)=>{
                if (inst==null)
                  return <></>;
                else if (!inst["S"] || inst["S"]==DocumentStatusList[1])
                  return <UploadFileButton key={props.AID+index} index={index} 
                    disabled={(!props.admin && !userPermissions[sectionNames[props.label]]["file"].includes("add")) || (props.admin && !userPermissions[panopticSectionNames[props.label]]["file"].includes("add"))}
                    AID={props.AID} sectionKeyName={props.sectionDetails.sectionKeyName} docId={index} _id={scheduleId}
                    setAdded={setAdded} isPayment
                  />
                else
                  return <ViewFileButton key={props.AID+index} type="pay" 
                    disabled={(!props.admin && !userPermissions[sectionNames[props.label]]["file"].includes("view") || (props.admin && !userPermissions[panopticSectionNames[props.label]]["file"].includes("view")))}
                    AID={props.AID} scheduleId={scheduleId} sectionKeyName={props.sectionDetails.sectionKeyName} index={index}
                    setAdded={setAdded} schedule={paymentData} setIsDeleted={setIsDeleted}
                    status={inst["S"]} rejectionReason={inst["R"]} 
                    actualName={(inst.FD && inst.FD[0] && inst.FD[0].originalname)?inst.FD[0].originalname:""} 
                    fileName={(inst.FD && inst.FD[0] && inst.FD[0].filename)?inst.FD[0].filename:""} 
                  />
              })
            }  
          />
        :<LoadingMessage sectionName="data" />
      }
      {paymentData && paymentData.length>0
        ?<Pagination className="mx-5" currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
        :<></>
      }
      {toastOptions?<Toast toastOptions={toastOptions} setToastOptions={setToastOptions} />:<></>}
    </div>
  )
}

export default SingleDealPayments;
