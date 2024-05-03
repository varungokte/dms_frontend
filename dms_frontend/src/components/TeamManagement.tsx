import { useState } from "react";
import { BodyRowsMapping, HeaderRows } from "./BasicComponents/Table";
import { Table } from "./ui/table";
import { Link } from "react-router-dom";

function TeamManagement(){
  const [teamList, setTeamList] = useState([
    ["team1", 20]
  ])
  return(
    <div>
			<p className="text-3xl font-bold m-7">Team Management</p>
      <br/>
      <div className="bg-white rounded-xl m-5">
        <Table>
          <HeaderRows headingRows={[["Agreement ID"], ["Total Members"], ["View Team"]]} />
          <BodyRowsMapping 
            list={teamList} dataType={["text", "text", "action"]}
            searchRows={[]} filterRows={[]}
            action={teamList.map(team=>
              {return <Link to={`${team[0]}`}>Go to Team</Link>}
            )}
          />
        </Table>
      </div>
    </div>
  )
}

export default TeamManagement;