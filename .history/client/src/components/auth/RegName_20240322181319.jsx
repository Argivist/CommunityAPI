import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

//css
import './../../css/auth/animation.css';
//login tab
function RegName({ handleDivChange }) {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);
  // navigation
  const change = (opt) => {
    if (opt == 1) {
      handleDivChange(1);
    } else {
      handleDivChange(3);
    }
  }


  return (
    <div className={isVisible ? 'slide-in active form' : 'slide-in'} id="login">
      <input type="text" name="fname" placeholder="First Name" />
      <input type="text" name="lname" placeholder="Last Name" />
      <input type="text" name="nname" placeholder="Nick name" />
      <div className="login_btn">
        <button onClick={() => change(1)}>
          Log In
        </button>
        <button onClick={() => change(2)}>
          <img src="https://img.icons8.com/15/play" alt="next" />
        </button>
      </div>
    </div>
  )
}


//Props validation
// Prop validation
RegName.propTypes = {
  handleDivChange: PropTypes.func.isRequired
};

//export login
export default RegName;