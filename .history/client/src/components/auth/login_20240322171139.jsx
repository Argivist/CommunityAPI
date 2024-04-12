import PropTypes from 'prop-types';

//login tab
function Login({handleDivChange}){

    const change = () => {
        handleDivChange(2);
    }

return(
    <div className="form" id="login">
    <input type="text" name="user" placeholder="Username/NickName/email" />
    <input type="password" name="password" placeholder="Password" />
    <div className="login_btn">
      <button>
        Log In
      </button>
      <button onClick={()=>change}>
        Sign Up
      </button>
    </div>
  </div>
)
}


//Props validation
// Prop validation
Login.propTypes = {
    handleDivChange: PropTypes.func.isRequired
  };

//export login
export default Login;