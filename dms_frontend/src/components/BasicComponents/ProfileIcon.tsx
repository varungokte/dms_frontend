function ProfileIcon(props:any) {
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
}

export default ProfileIcon;