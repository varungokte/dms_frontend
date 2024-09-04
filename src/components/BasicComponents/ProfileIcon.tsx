function ProfileIcon(props:{size:"large"|"small", name:string, showStatus?:boolean, className?:string}) {
  const sizes = {
    large:{
      height:"200px",
      width:"200px",
      lineHeight:"200px",
      fontSize:"60px",
    },
    small:{
      height:"50px",
      width:"50px",
      lineHeight:"50px",
      fontSize:"19px",
    }
  }
  return (
    <div style={{
      height:sizes[props.size].height, 
      width:sizes[props.size].width, 
      lineHeight:sizes[props.size].lineHeight, 
      borderRadius:"50%", textAlign:"center", backgroundColor: "goldenrod", color:"white"
    }} className={props.className} >
      <div style={{textAlign:"center", fontSize:sizes[props.size].fontSize}}>
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