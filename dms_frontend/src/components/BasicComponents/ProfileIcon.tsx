function ProfileIcon(props:any) {
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
  else if (props.size=="small")
    return (
      <div 
      style=
      {{
        height:"50px", width:"50px", lineHeight:"50px", 
        borderRadius:"50%", textAlign:"center", fontSize:"15px", 
        backgroundColor: "goldenrod", color:"white"
      }}
      >
        {props.name.split(" ").map((name:String)=>{return name[0]})}
      </div>
    )
}

export default ProfileIcon;

/* props:
  size= "large" or "small"
  name="Harvey Dent"
*/