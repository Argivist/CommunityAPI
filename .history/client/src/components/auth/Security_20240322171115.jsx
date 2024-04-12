import PropTypes from 'prop-types';

//login tab
function Security({handleDivChange}){
// navigation
    const change = () => {
    
        handleDivChange(3);
      
    }


return(
    <div className="form" id="login">
    <input type="password" name="pwd" placeholder="Enter Password" />
    <input type="password" name="pwd" placeholder="Re-enter Password" />
    <div className="login_btn">
        <button onClick={()=>change}>
          <img src="https://img.icons8.com/15/back" alt="back" />
        </button>
        <button>
        Register
        </button>
      </div>
  </div>
)
}


//Props validation
// Prop validation
Security.propTypes = {
    handleDivChange: PropTypes.func.isRequired
  };

//export login
export default Security;