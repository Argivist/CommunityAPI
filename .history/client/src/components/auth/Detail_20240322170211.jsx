import PropTypes from 'prop-types';

//login tab
function Detail({handleDivChange}){
// navigation
    const change = (opt) => {
      if(opt==1){
        handleDivChange(2);
      }else{
        handleDivChange(4);
      }
    }


return(
<div className=" form" id="login">
            <div>
              <input type="text" name="fname" placeholder="First Name" />
              <input type="text" name="lname" placeholder="Last Name" />   </div>
            <input type="text" name="nname" placeholder="Nickame" />
            <div className="login_btn">
              <button onClick={change(1)}>
            Log In
              </button>
              <button onClick={change(2)}>
                <img src="https://img.icons8.com/15/play" alt="next" />
              </button>
            </div>
          </div>
)
}


//Props validation
// Prop validation
Detail.propTypes = {
    handleDivChange: PropTypes.func.isRequired
  };

//export login
export default Detail;