//login tab
function login({handleDivChange}){
return(
    <div className="form" id="login">
    <input type="text" name="user" placeholder="Username/NickName/email" />
    <input type="password" name="password" placeholder="Password" />
    <div className="login_btn">
      <button>
        Log In
      </button>
      <button onClick={handleDivChange}>
        Sign Up
      </button>
    </div>
  </div>
)
}
//export login
export default login;