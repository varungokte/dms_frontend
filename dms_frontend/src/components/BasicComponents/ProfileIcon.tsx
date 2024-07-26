function ProfileIcon(props:{size:"large"|"small", name:string, showStatus?:boolean, className?:string}) {
  return (
    <div style={{
      height:props.size=="large"?"100px":"50px", 
      width:props.size=="large"?"100px":"50px", 
      lineHeight:props.size=="large"?"100px":"50px", 
      borderRadius:"50%", textAlign:"center", backgroundColor: "goldenrod", color:"white"
    }} className={props.className} >
      <div style={{textAlign:"center", fontSize:props.size=="large"?"30px":"15px"}}>
        {(props.name||"E R R").split(" ").map(name=>name.charAt(0))}
      </div>

      {props.showStatus
        ?<div style={{
          height:"13px", width:"13px", borderRadius:"50%",position:"absolute",
          backgroundColor: "green", borderColor:"white", zIndex:"1", 
          transform: "translate(35px, -13px)", padding:"0px"
        }}></div>
        :<></>
      }
    </div>
  )  
}

export default ProfileIcon;