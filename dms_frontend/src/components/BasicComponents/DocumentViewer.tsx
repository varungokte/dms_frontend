import { useEffect, useState } from "react";
import useGlobalContext from "./../../../GlobalContext";
import { useNavigate, useParams } from "react-router-dom";

function DocumentViewer(){
  const [showDoc, setShowDoc] = useState(<></>);

	const {id} =  useParams();
	const navigate = useNavigate();

  const {fetchDocument}=useGlobalContext();
  
  useEffect(()=>{
    console.log("fetching the document");
    const AID="test_agreement_1";
    const sectionName="TD"; 
    const docName="Lenders Agent Agreement";
    const fileName="1716803032797-data2.pdf";

    fetchDocument(AID, sectionName,docName,fileName).then(res=>{
      console.log(res);
      setShowDoc(<iframe src={res.url} width="100%" height="600px" title="Document Viewer"></iframe>)
    }).catch(err=>{
      console.log("an error", err)
    })
  },[]);

  const exitViewer = () => {
    navigate("/")
  }

  return (
    <div>
      <button onClick={()=>exitViewer()}>Go back</button>
      {id}
      {showDoc}
    </div>
  )
}

export default DocumentViewer;