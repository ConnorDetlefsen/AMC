import React, { Component } from "react";
import UserContext from "../Context/UserContext";

class QuizResults extends Component {
  static contextType = UserContext;

  state = {};

  async componentDidMount() {
    const { history } = this.props;

    if (this.context.currentUser.username === null) {
      history.push("/");
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="centerTest background">
          <h1>Download Results</h1>
          <h1>
            <a
              href={
                "https://amc-pdf.s3-us-west-1.amazonaws.com/results" +
                this.context.currentUser.ID
              }
            >
              Data Download
            </a>
          </h1>
          <br />

          <h3>
            If the download does not work, your professor is still working on
            grades.
          </h3>
        </div>
      </React.Fragment>
    );
  }
}

export default QuizResults;
