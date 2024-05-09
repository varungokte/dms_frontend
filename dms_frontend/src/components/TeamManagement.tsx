import { useEffect, useState } from "react";
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import { Table } from "./ui/table";
import { Link } from "react-router-dom";
import useGlobalContext from "./../../GlobalContext";

function TeamManagement(){
  const [teamList, setTeamList] = useState([
    {T:"team1", C:20}
  ]);

  const {useTitle} = useGlobalContext();

  useTitle("Team Management")

  return(
    <div>
			<p className="text-3xl font-bold m-7">Team Management</p>
      <br/>
      <div className="bg-white rounded-xl m-5">
        <Table>
          <HeaderRows headingRows={[["Agreement ID"], ["Total Members"], ["View Team"]]} />
          <BodyRowsMapping 
            list={teamList} columns={["T","C"]} dataType={["text", "text", "action"]}
            searchRows={[]} filterRows={[]}
            action={teamList.map(team=>
              {return <Link to={`${team["T"]}`}>Go to Team</Link>}
            )}
          />
        </Table>
      </div>
    </div>
  )
}

export default TeamManagement;