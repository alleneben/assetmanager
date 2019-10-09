import React from 'react';

import './test.css';

class Test extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            style : {
                width : '100%'
            }
        };
        this.openNav = this.openNav.bind(this);
        this.closeNav = this.closeNav.bind(this);
    }

    componentDidMount() {
        document.addEventListener("click", this.closeNav);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.closeNav);
    }

    openNav() {
        const style = { width : '100%' };
        this.setState({ style });
        document.body.style.backgroundColor = "rgba(0,0,0,0.9)";
        document.addEventListener("click", this.closeNav);
    }

    closeNav() {
        document.removeEventListener("click", this.closeNav);
        const style = { width : 0 };
        this.setState({ style });
        document.body.style.backgroundColor = "#F3F3F3";
    }

    render() {
        return (
          <div>
            <span style={{fontSize:30,cursor:"pointer"}} onClick={this.openNav}>&#9776; open</span>
            <div  ref="snav" className="overlay" style={this.state.style} >
                <div className = "sidenav-container">
                    <a
                        href      = "javascript:void(0)"
                        className = "closebtn"
                        onClick   = {this.closeNav}
                    >
                        ×
                    </a>

                      {this.props.children}

                </div>
            </div>
          </div>
        );
    }
}

export default Test;
