import React, { Component } from "react";
import http from "../APIServices/httpService";
import config from "../APIServices/config.json";
import UserContext from "../Context/UserContext";
import { ToastContainer, toast } from "react-toastify";

class Question extends Component {
  static contextType = UserContext;

  constructor() {
    super();
    this.state = {
      Question: "",
      Choice_one: "",
      Choice_two: "",
      Choice_three: "",
      Choice_four: "",
      Correct_answer: "",
      Question_id: null,
      QuestionList: [],
      index: 1,
      TotalQuestions: 0,

      ReRender: false,
      isCorrect: false,
      selectedOption: null,
      isChecked1: false,
      isChecked2: false,
      isChecked3: false,
      isChecked4: false,
    };
    this.oneFirstChange = this.oneFirstChange.bind(this);
    this.oneSecondChange = this.oneSecondChange.bind(this);
    this.oneThirdChange = this.oneThirdChange.bind(this);
    this.oneFourthChange = this.oneFourthChange.bind(this);
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

    if (this.context.currentUser.completed_quiz === true) {
      history.push("/results");
    }

    http.get(config.apiEndpoint + "/quiz/").then((res) => {
      console.log(res.data);
      this.shuffle(res.data);

      this.state.Question = res.data[0].question;
      this.state.Choice_one = res.data[0].mc_option1;
      this.state.Choice_two = res.data[0].mc_option2;
      this.state.Choice_three = res.data[0].mc_option3;
      this.state.Choice_four = res.data[0].mc_option4;
      this.state.Correct_answer = res.data[0].correct_answer;
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
      history.push("/freeresponse");
      return;
    }

    this.state.Question = QuestionList[index].question;
    this.state.Choice_one = QuestionList[index].mc_option1;
    this.state.Choice_two = QuestionList[index].mc_option2;
    this.state.Choice_three = QuestionList[index].mc_option3;
    this.state.Choice_four = QuestionList[index].mc_option4;
    this.state.Correct_answer = QuestionList[index].correct_answer;
    this.state.question_id = QuestionList[index].question_id;
    this.setState({
      isChecked1: false,
      isChecked2: false,
      isChecked3: false,
      isChecked4: false,
    });
    this.state.index = this.state.index + 1;

    this.ReRender();
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state.selectedOption);
    toast.success(`Question Submitted`);

    if (this.state.selectedOption === this.state.Correct_answer) {
      this.state.isCorrect = true;
    } else {
      this.state.isCorrect = false;
    }
    http
      .post(config.apiEndpoint + "/results/", {
        user_id: this.context.currentUser.ID,
        quiz_id: this.context.currentUser.Quiz_id,
        question_id: this.state.question_id,
        answer: this.state.selectedOption,
        correct: this.state.isCorrect,
        section_id: this.context.currentUser.Section_id,
      })
      .then((res) => {
        console.log(res);
      });
    this.setState({ selectedOption: null });
    this.nextQuestion();
  };

  oneFirstChange(event) {
    this.setState({
      selectedOption: event.target.value,
      isChecked1: !this.state.isChecked1,
      isChecked2: false,
      isChecked3: false,
      isChecked4: false,
    });
  }
  oneSecondChange(event) {
    this.setState({
      selectedOption: event.target.value,
      isChecked2: !this.state.isChecked2,
      isChecked1: false,
      isChecked3: false,
      isChecked4: false,
    });
  }
  oneThirdChange(event) {
    this.setState({
      selectedOption: event.target.value,
      isChecked3: !this.state.isChecked3,
      isChecked1: false,
      isChecked2: false,
      isChecked4: false,
    });
  }
  oneFourthChange(event) {
    this.setState({
      selectedOption: event.target.value,
      isChecked4: !this.state.isChecked4,
      isChecked1: false,
      isChecked2: false,
      isChecked3: false,
    });
  }

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
                <input
                  type="radio"
                  name="radio"
                  id="radio1"
                  value={this.state.Choice_one}
                  onChange={this.oneFirstChange}
                  checked={this.state.isChecked1}
                />
                <label for="radio1">{this.state.Choice_one}</label>
              </div>
              <div className="inputGroup">
                <input
                  type="radio"
                  name="radio"
                  id="radio2"
                  value={this.state.Choice_two}
                  onChange={this.oneSecondChange}
                  checked={this.state.isChecked2}
                />
                <label for="radio2">{this.state.Choice_two}</label>
              </div>
              <div className="inputGroup">
                <input
                  type="radio"
                  name="radio"
                  id="radio3"
                  value={this.state.Choice_three}
                  onChange={this.oneThirdChange}
                  checked={this.state.isChecked3}
                />
                <label for="radio3">{this.state.Choice_three}</label>
              </div>
              <div className="inputGroup">
                <input
                  type="radio"
                  name="radio"
                  id="radio4"
                  value={this.state.Choice_four}
                  onChange={this.oneFourthChange}
                  checked={this.state.isChecked4}
                />
                <label for="radio4">{this.state.Choice_four}</label>
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

export default Question;
