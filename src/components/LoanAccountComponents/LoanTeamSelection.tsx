import { useContext, useEffect, useState } from "react";
import { LoanCommonProps } from "@/types/ComponentProps";
import { PermissionContext } from "@/Contexts";
import { getTeamsList, selectTeam } from "@/apiFunctions/teamAPIs";

import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import EmptyPageMessage from "../BasicMessages/EmptyPageMessage";
import LoadingMessage from "../BasicMessages/LoadingMessage";
import SearchByType from "../BasicComponents/SearchByType";
import DataTable from "../BasicTables/Table";
import { Pagination } from "../BasicComponents/Pagination";

function LoanTeamSelection(props:LoanCommonProps){
  const [teamList, setTeamList] = useState<any>();
  
  const {userPermissions} = useContext(PermissionContext);

  const [selectedTeam, setSelectedTeam] = useState([""]);
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
          setSelectedTeam([res.obj["currentTeam"]["_teamId"]]);
        //console.log("teams list",res.obj.list[0]["data"])
        setTeamList(res.obj.list[0]["data"]);
      }
      else
        setTeamList([]);
    }).catch(()=>{
      setTeamList([]);
    })
  },[currentPage, rowsPerPage, searchString, searchType]);

  useEffect(()=>console.log("selected team",selectedTeam),[selectedTeam])

  const sendTeam = async (e:any) =>{
    e.preventDefault();
    if (!userPermissions["team"].includes("select")){
      if (selectedTeam && selectedTeam[0]!="")
        props.goToNextSection();
      return;
    }

    if (!selectedTeam || selectedTeam[0]==""){
      setErrorMessage(<div className="text-lg mx-3 text-red-600">You must select one of the following teams.</div>);
      return;
    }
    const data = {
      "_loanId":props.loanId,
      "_teamId": selectedTeam[0] //teamList[selectedTeam]["_id"]
    }

    const res = await selectTeam(data);
    console.log("res",res);
    if (res==200)
      props.goToNextSection({enableDocumentSections:true});
  };  

  return (
    <div className="mt-8">
      <div className="flex flex-row">
        <SearchByType className="mx-3" searchString={searchString} setSearchString={setSearchString} searchType={searchType} setSearchType={setSearchType} typeOptions={searchOptions} />
      </div>
      <br />
      <form onSubmit={sendTeam}>
        {userPermissions["team"].includes("select")?errorMessage:<></>}
        <div className="flex flex-row flex-wrap mx-3">
          {teamList
            ?teamList.length==0
              ?<EmptyPageMessage sectionName="teams" />
              :<DataTable
                tableData={teamList} 
                columnData={[
                  {id:"N", heading:"Team Name", type:"text"},
                  {id:"L", heading:"Team Lead", type:"text"},
                  {id:"createdAt", heading:"Created On", type:"date"},
                  {id:"S", heading:"Status", type:"team-status"}
                ]}
                selectable={userPermissions["team"].includes("select")?{
                  type:"row",
                  selectedRows: selectedTeam,
                  setSelectedRows: setSelectedTeam,
                }:undefined}
                //indexStartsAt={(currentPage-1)*rowsPerPage}
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
        <FormSectionNavigation isForm={true} currentSection={props.currentSection} sectionCount={props.sectionCount} goToPreviousSection={props.goToPreviousSection} goToNextSection={props.goToNextSection} actionType={props.actionType} />
      </form>
    </div>
  )
}

export default LoanTeamSelection;