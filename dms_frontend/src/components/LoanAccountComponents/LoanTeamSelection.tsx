import { useContext, useEffect, useState } from "react";
import { LoanCommonProps } from "./../../../DataTypes";
import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import useGlobalContext from "../../../GlobalContext";
import EmptyPageMessage from "../BasicMessages/EmptyPageMessage";
import LoadingMessage from "../BasicMessages/LoadingMessage";
import SearchByType from "../BasicComponents/SearchByType";
import { DataTable } from "../BasicComponents/Table";
import { Pagination } from "../BasicComponents/Pagination";
import { PermissionContext } from "@/MenuRouter";

function LoanTeamSelection(props:LoanCommonProps){
  const [teamList, setTeamList] = useState<any>();

  const { getTeamsList, selectTeam } = useGlobalContext();
  
  const {userPermissions} = useContext(PermissionContext);

  const [selectedTeam, setSelectedTeam] = useState("");
  const [errorMessage, setErrorMessage] = useState(<div className="text-lg mx-3 text-blue-600">Select one of the following teams</div>);
  
  const [searchString, setSearchString] = useState("");
  const [searchType, setSearchType] = useState("");
  const searchOptions = [{label:"Team Name", value:"N"}, {label:"Team Lead's Email", value:"L"}];

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(()=>{
    getTeamsList({loanId:props.loanId, currentPage, rowsPerPage, searchString, searchType}).then(res=>{
      if (res.status==200){ 
        console.log("response",res.obj)
        setTotalPages(Math.ceil(Number(res.obj["list"][0]["metadata"][0]["total"])/Number(rowsPerPage)));
        if (res.obj["currentTeam"])
          setSelectedTeam(res.obj["currentTeam"]["_teamId"]);
        //console.log("teams list",res.obj.list[0]["data"])
        setTeamList(res.obj.list[0]["data"]);
      }
      else
        setTeamList([]);
    }).catch(()=>{
      setTeamList([]);
    })
  },[currentPage, rowsPerPage, searchString, searchType]);

  //useEffect(()=>console.log("selected team",selectedTeam),[selectedTeam])

  const sendTeam = async (e:any) =>{
    e.preventDefault();
    if (selectedTeam==""){
      setErrorMessage(<div className="text-lg mx-3 text-red-600">You must select one of the following teams.</div>);
      return;
    }
    const data = {
      "_loanId":props.loanId,
      "_teamId": selectedTeam //teamList[selectedTeam]["_id"]
    }

    const res = await selectTeam(data)
    console.log("res",res);
    if (res==200){
      props.goToNextSection();
      props.setEnableDocumentSections(true);
    }
  };  

  return (
    <div className="mt-8">
      <div className="flex flex-row">
        <SearchByType className="mx-3" searchString={searchString} setSearchString={setSearchString} searchType={searchType} setSearchType={setSearchType} typeOptions={searchOptions} />
      </div>
      <br />
      <form onSubmit={sendTeam}>
        {errorMessage}
        <div className="flex flex-row flex-wrap mx-3">
          {teamList
            ?teamList.length==0
              ?<EmptyPageMessage sectionName="teams" />
              :<DataTable 
                selectable={userPermissions["team"].includes("select")} selectedEntity={selectedTeam} setSelectedEntity={setSelectedTeam} 
                headingRows={["Team Name", "Team Lead", "Created On", "Status"]}
                dataTypes={["text", "text","date", "team-status"]}
                tableData={teamList} columnIDs={["N","L","createdAt","S"]}
                indexStartsAt={(currentPage-1)*rowsPerPage}
              />
            :<LoadingMessage sectionName="a list of teams" />
          }
        </div>
        <br />

        {teamList && teamList.length>0
          ?<Pagination className="mx-3" currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage} />
          :<></>
        }
        <br />
        <FormSectionNavigation isForm={true} currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} sectionCount={props.sectionCount} goToNextSection={props.goToNextSection} actionType={props.actionType} />
      </form>
    </div>
  )
}

export default LoanTeamSelection;