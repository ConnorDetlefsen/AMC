import React, { Component } from "react";
import Joi from "joi-browser";
import http from "../APIServices/httpService";
import config from "../APIServices/config.json";
import { ToastContainer, toast } from "react-toastify";
import UserContext from "../Context/UserContext";
import Input from "./Input";

class QuizPassword extends Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = { password_input: "", errors: {}, passwordList: {} };

    this.handleChange = this.handleChange.bind(this);
  }

  schema = {
    password: Joi.string().required().label("password"),
  };

  async componentDidMount() {
    const { history } = this.props;

    if (this.context.currentUser.username === null) {
      history.push("/");
    }

    http.get(config.apiEndpoint + "/quiz_passwords/").then((res) => {
      console.log(res.data);
      this.setState({ passwordList: res.data });
    });
  }

  //used in do submit to send successfully logged in user to quiz
  sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.account, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) {
      errors[item.path[0]] = item.message;
    }
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();

    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  handleChange(event) {
    this.setState({ password_input: event.target.value });
  }

  /* token do submit 
  doSubmit = async () => {
    try {
      const { account } = this.state;
      const { data } = await login(account.username, account.password);
      localStorage.setItem("token", data.token);
      //this.props.history.push("/quiz");
      window.location = "/quiz";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const errors = { ...this.state.errors };
        errors.username = ex.response.account;
        this.setState({ errors });
      }
    }
  }; */

  // do submit from bas
  doSubmit = async () => {
    const { passwordList, password_input } = this.state;
    const { history } = this.props;

    for (let x in passwordList) {
      if (
        password_input.replace(/\s+/g, " ").trim().toLowerCase() ===
        passwordList[x].password.toLowerCase()
      ) {
        this.context.currentUser.Section_id = passwordList[x].section_id;
        this.context.currentUser.Quiz_id = passwordList[x].quiz_id;

        //tracks user log in
        /* http
          .post(config.apiEndpoint + "/logintracking/", {
            user_id: userList[x].id,
          })
          .then((res) => {
            console.log(res);
          });*/

        toast.success(`Success!`);

        await this.sleep(2000);

        history.push("/quiz");
      } else {
        toast.error("Invalid Password");
      }
    }
  };

  render() {
    const { password_input } = this.state;
    return (
      <React.Fragment>
        <ToastContainer />

        <div className="background">
          <div className="login-page ">
            <div className="login-css">
              <div className="login-form">
                <div className="login">
                  <div className="Login Header">
                    <h1>
                      <b>Quiz Password</b>
                    </h1>
                  </div>
                </div>
                <form className="login-form " onSubmit={this.handleSubmit}>
                  <Input
                    className="login-input"
                    value={password_input}
                    label="Password"
                    onChange={this.handleChange}
                  />
                  <div>
                    <br />
                  </div>
                  <button
                    disabled={this.validate()}
                    className="btn btn-primary login-button"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default QuizPassword;
