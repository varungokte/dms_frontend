import { useContext, useEffect, useState } from "react";
import { getModSecName, getPanSecName } from "@/functions/sectionNameAttributes";
import { DocumentSectionDetails } from "@/types/DataTypes";
import { statusValues } from "@/Constants";
import { getPaymentSchedule } from "@/apiFunctions/paymentAPIs";
import { ToastOptionsAttributes } from "@/types/DataTypes";
import { PermissionContext } from "@/Contexts";

import DataTable from "./BasicTables/Table";
import UploadFileButton from "./BasicButtons/UploadFileButton";
import ViewFileButton from "./BasicButtons/ViewFileButton";
import EmptyPageMessage from "./BasicMessages/EmptyPageMessage";
import LoadingMessage from "./BasicMessages/LoadingMessage";
import { Pagination } from "./BasicComponents/Pagination";
import Toast from "./BasicComponents/Toast";

function SingleDealPayments(props:{label:string, loanId:string, AID:string, sectionDetails:DocumentSectionDetails, admin:boolean}){
  const [paymentData, setPaymentData] = useState<any>();
  const [added, setAdded] = useState(true);
  const [scheduleId, setScheduleId] = useState("");
  const [isDeleted, setIsDeleted] = useState<number>();
  const [toastOptions, setToastOptions] = useState<ToastOptionsAttributes>();
  
  const {userPermissions} = useContext(PermissionContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const {DocumentStatusList} = statusValues;

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
            tableData={paymentData}
            columnData={[
              {id:"D", heading:"Installment Date", type:"text", headingClassName:"w-[30%]"},
              {id:"I", heading:"Installment Interest Rate (%)", type:"text-field", headingClassName:"mx-7"},
              {id:"S", heading:"Status", type:"doc-status"}
            ]}
            showIndex={{
              startsAt:0,
              heading:"Installment Number",
              headingClassName:"w-[100px]"
            }}
            action={
              paymentData.map((inst:any,index:number)=>{
                if (inst==null)
                  return <></>;
                else if (!inst["S"] || inst["S"]==DocumentStatusList[1])
                  return <UploadFileButton key={props.AID+index} index={index} 
                    disabled={(!props.admin && !userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})]["file"].includes("add")) || (props.admin && !userPermissions[getPanSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})]["file"].includes("add"))}
                    AID={props.AID} sectionKeyName={props.sectionDetails.sectionKeyName} docId={index} _id={scheduleId}
                    setAdded={setAdded} isPayment
                  />
                else
                  return <ViewFileButton key={props.AID+index} type="pay" 
                    disabled={(!props.admin && !userPermissions[getModSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})]["file"].includes("view") || (props.admin && !userPermissions[getPanSecName({inputName:props.label, inputType:"fullname", outputType:"shortname"})]["file"].includes("view")))}
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
