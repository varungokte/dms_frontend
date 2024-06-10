//import { useEffect, useState } from "react";
//import useGlobalContext from "./../../../GlobalContext";
//import { useNavigate, useParams } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger, } from "@/components/ui/alert-dialog";

function DocumentViewer(/* props:{filename:string} */){
  /* const [showDoc, setShowDoc] = useState(<></>);
  const [filename,setFileName] = useState("1717389810902-data2.pdf")

	const {id} =  useParams();
	const navigate = useNavigate();

  const {fetchDocument}=useGlobalContext();
  
  useEffect(()=>{
    console.log("fetching the document");
    const AID="test_agreement_1";
    const sectionName="TD"; 
    const docName="Common Loan Agreements";
    const fileName="1717389810902-data2.pdf";

    fetchDocument(AID, sectionName,docName,fileName).then(res=>{
      console.log(res);
      setShowDoc(<iframe src={res.url} width="200%" height="600px" title="Document Viewer"></iframe>)
    }).catch(err=>{
      console.log("an error", err)
    })
  },[]);

  const exitViewer = () => {
    navigate("/")
  }
 */
  return (
    <AlertDialog>
      <AlertDialogTrigger>Open</AlertDialogTrigger>
      <AlertDialogContent className="bg-white ">
        <AlertDialogHeader className="">
        </AlertDialogHeader>
        <FileTitleBar filename={/* filename */"A"} />
        {/* <div>
          {showDoc}
        </div> */}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function FileTitleBar(props:{filename:string}){
  return (
    <div>
      <div className="flex flex-row">
        <p className="flex-auto">{props.filename}</p>
        <button className="border-2 mx-5 p-2 rounded-if">Reject</button>
        <button className="bg-lime-500 text-white p-2 rounded-if">Verify</button>
      </div>
    </div>
  )
}

export default DocumentViewer;