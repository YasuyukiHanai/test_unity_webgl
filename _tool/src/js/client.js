import React from "react";
import ReactDOM from "react-dom";
import styled from "../scss/_test.module.scss";

// class Layout extends React.Component {
//   render() {
//     return (
//       <h1>Welcome!</h1>
//     );
//   }
// }

class TemplateComponent extends React.Component {
  render() {
    return (
      <main>
        <header>
          <h2>{this.props.title}</h2>
        </header>
        <div>
          <MainComponent />
        </div>
        <footer>
          <p>copyright company</p>
        </footer>
      </main>
    )
  }
}

class ChildComponent extends React.Component {
  render() {
    return (
      <p className={styled.test}>コンテンツテキストです。</p>
    )
  }
}

class MainComponent extends React.Component {
  render() {
    return (
      <section>
        <h1>Main Title</h1>
        <ChildComponent />
      </section>
    )
  }
}

const app = document.getElementById('app');
ReactDOM.render(<TemplateComponent/>, app);

