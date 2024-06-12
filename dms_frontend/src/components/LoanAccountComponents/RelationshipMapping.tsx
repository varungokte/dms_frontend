import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import ProfileIcon from "../BasicComponents/ProfileIcon";
import { FormSectionNavigation } from "../FormComponents/FormSectionNavigation";
import useGlobalContext from "./../../../GlobalContext";
import EmptyPageMessage from "../BasicComponents/EmptyPageMessage";
import LoadingMessage from "../BasicComponents/LoadingMessage";

function RelationshipMapping(props:{key:number,actionType: string, loanId: string, setLoanId: Function, AID: string, setAID: Function, currentSection: number, setCurrentSection: Function, goToNextSection: Function, setUnsavedWarning: Function, label: string, setShowSecurityDetails: Function, showSecurityDetails: boolean, setOkToFrolic: Function, preexistingValues:any}){
  const [teamsList, setTeamList] = useState<any>();

  const { getTeamsList, selectTeam } = useGlobalContext();

  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(()=>{
    getTeamsList(props.loanId).then(res=>{
      if (res.status==200){ console.log("response",res.obj)
        setSelectedTeam(res.obj.currentTeam._teamId)
        setTeamList(res.obj.list);}
      else
        setTeamList([]);
    }).catch(()=>{
      setTeamList([]);
    })
  },[]);

  const sendTeam = (e:any) =>{
    e.preventDefault();
    const data = {
      "_loanId":props.loanId,
      "_teamId": selectedTeam
    }
    console.log("data",data)
    selectTeam(data).then(res=>{
      console.log("res",res);
      props.goToNextSection();
    }).catch(err=>{
      console.log("err",err);
    })
  };  

  return (
    <div className="mt-8">
      <div className="flex flex-row">
      </div>

      <form onSubmit={sendTeam}>
        <div className="flex flex-row flex-wrap">
          {teamsList
            ?teamsList.length==0
              ?<EmptyPageMessage sectionName="teams" />
              :teamsList.map((team:any,index:number)=>{
                console.log("team",team)
                return (
                  <Card key={index} className={`mr-5 my-5 w-72 rounded-xl hover: ${selectedTeam===team["_id"]?"border-2 border-double border-violet-800	":""}`} onClick={()=>setSelectedTeam(team["_id"])}>
                    <CardHeader>
                      <CardTitle>	
                        <div className="flex flex-row">
                          <div className="flex-auto">
                            <ProfileIcon name={team["N"]} size="small" />
                          </div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-left">
                      <p className="font-medium">{team["N"]}</p>
                      <p className="font-light">{team["L"]["N"]}</p>
                    </CardContent>
                  </Card>
                )
              })  
            :<LoadingMessage sectionName="a list of teams" />
          }
        </div>
        <FormSectionNavigation isForm={true} currentSection={props.currentSection} setCurrentSection={props.setCurrentSection} goToNextSection={props.goToNextSection} />
      </form>
    </div>
  )
}

export default RelationshipMapping;