function ProfileIcon(props:{size:"large"|"small", name:string, showStatus?:boolean}) {
  try{
    if (props.size=="large")
      return (
        <div 
          style=
          {{
            height:"100px", width:"100px", lineHeight:"100px", 
            borderRadius:"50%", textAlign:"center", fontSize:"30px", 
            backgroundColor: "goldenrod", color:"white"
          }}
        >
          {props.name.split(" ").map((name:String)=>{return name[0]})}
        </div>
      )
    else if (props.size=="small" && props.showStatus)
      return (
        <div 
          style={{
            height:"50px", width:"50px", lineHeight:"50px", 
            borderRadius:"50%", backgroundColor: "goldenrod", color:"white",
            zIndex:"2", position:"relative"
          }}
        >
          <div style={{textAlign:"center", fontSize:"15px"}}>
            {props.name.split(" ").map((name:String)=>{return name[0]})}
          </div>
          <div 
            style={{
              height:"13px", width:"13px", borderRadius:"50%",position:"absolute",
              backgroundColor: "green", borderColor:"white", zIndex:"1", 
              transform: "translate(35px, -13px)", padding:"0px"
            }}
          >
          </div>
        </div>
      )    
    else if (props.size=="small")
      return (
        <div 
          style={{
            height:"50px", width:"50px", lineHeight:"50px", 
            borderRadius:"50%", backgroundColor: "goldenrod", color:"white",
            zIndex:"2", position:"relative"
          }}
        >
          <div style={{textAlign:"center", fontSize:"15px"}}>
            {props.name.split(" ").map((name:String)=>{return name[0]})}
          </div>
        </div>
      )
  }
  catch(err){
    return (
      <div 
        style={{
          height:"50px", width:"50px", lineHeight:"50px", 
          borderRadius:"50%", backgroundColor: "goldenrod", color:"white",
          zIndex:"2", position:"relative"
        }}
      >
        <div style={{textAlign:"center", fontSize:"15px"}}>
          {"ERR"}
        </div>
      </div>
    )
  }
}

export default ProfileIcon;

/* props:
  size= "large" or "small"
  name="Harvey Dent"
*/