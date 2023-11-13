import './Login.css';
import { Component } from 'react';

async function loginUser(info) {
  return fetch('http://localhost:9000/api/account/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(info)
  })
  .then( data => data.json())
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      loggedIn: false,
      error: '',
    };
  }

  

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  //Api call here
  handleLogin = async (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    console.log(email);
    console.log(password);

    const response = await loginUser({
      email,
      password
    });

    if('accessToken' in response) {
      alert("Sucess");
      (value) => {
        localStorage.setItem('accessToken', response['accessToken']);
        localStorage.setItem('user', JSON.stringify(response['user']))
      }
    }
    else {
      alert("Error - no token detected")
    }

    //Debug just to test if its passing correct arguments
    // const { email, password } = this.state;
    // alert(`Passed Email: ${email}\nPassed Password: ${password}`);
  };

  render() {
    return (
      <div>
        <div className="separator" />
        <div className="loginForm">
          <form onSubmit={this.handleLogin}>
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={this.state.email}
              onChange={this.handleEmailChange}
              required
            />

            <label>Password</label>
            <input
              style={{ marginBottom: '12px' }}
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
              required
            />
            <button id="centered" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
