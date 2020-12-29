import React, { Component } from "react";
import http from "../APIServices/httpService";
import config from "../APIServices/config.json";
import UserContext from "../Context/UserContext";
import { ToastContainer, toast } from "react-toastify";

class FreeResponse extends Component {
  static contextType = UserContext;

  constructor() {
    super();
    this.state = {
      Question: "",
      Question_id: null,
      QuestionList: [],
      index: 1,
      TotalQuestions: 0,

      answer: "",

      ReRender: false,
    };

    this.nextQuestion = this.nextQuestion.bind(this);
  }

  //this is used to shuffle the questions
  shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  ReRender() {
    // It simply sets the state to its current value
    this.setState({ ReRender: true });
  }

  async componentDidMount() {
    const { history } = this.props;

    if (this.context.currentUser.username === null) {
      history.push("/");
    }

    http.get(config.apiEndpoint + "/free_response_question/").then((res) => {
      console.log(res.data);
      this.shuffle(res.data);

      this.state.Question = res.data[0].question;
      this.state.question_id = res.data[0].question_id;

      this.setState({ QuestionList: res.data });
      this.ReRender();
      for (let x in this.state.QuestionList) {
        this.state.TotalQuestions = this.state.TotalQuestions + 1;
        console.log(this.state.TotalQuestions);
      }
    });
  }

  nextQuestion = async () => {
    const { QuestionList, index, TotalQuestions } = this.state;
    const { history } = this.props;

    if (index === TotalQuestions) {
      toast.success(`Quiz Completed`);
      history.push("/QuizOver");
      return;
    }

    this.state.Question = QuestionList[index].question;
    this.state.question_id = QuestionList[index].question_id;
    this.setState({
      answer: "false",
    });
    this.state.index = this.state.index + 1;

    this.ReRender();
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.state.answer === "") {
      toast.error("You must enter an answer");
      return;
    }
    toast.success(`Question Submitted`);

    http
      .post(config.apiEndpoint + "/free_response_answer/", {
        user_id: this.context.currentUser.ID,
        quiz_id: this.context.currentUser.Quiz_id,
        question_id: this.state.question_id,
        answer: this.state.answer,
        section_id: this.context.currentUser.Section_id,
      })
      .then((res) => {
        console.log(res);
      });
    this.nextQuestion();
  };

  handleChange = (e) => {
    this.setState({ answer: e.target.value });
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer />

        <div className="background">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div>
              <div>
                {" "}
                AMC Project <br />
                <span>{this.context.currentUser.username}</span>
              </div>
            </div>
          </nav>
          <div>
            <h1 className="center">{this.state.Question}</h1>
            <form onSubmit={this.formSubmit} class="form">
              <div className="inputGroup">
                <textarea
                  onChange={this.handleChange}
                  className="form-control"
                  rows="6"
                  cols="10"
                  maxLength={920}
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn btn-dark float-right"
                onClick={this.handleSubmit}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default FreeResponse;
