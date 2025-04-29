import { Component } from "react";
import RegisterPage from "../pages/RegisterPage";

class RegisterComponents extends Component{
    constructor(props) {
        super(props);
        this.state = {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        };
    }
    
    handleInputChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };
    
    handleSubmit = (event) => {
        event.preventDefault();
        // Handle registration logic here
    };
    
    render() {
        return (
            <RegisterPage
                name={this.state.name}
                email={this.state.email}
                password={this.state.password}
                confirmPassword={this.state.confirmPassword}
                handleInputChange={this.handleInputChange}
                handleSubmit={this.handleSubmit}
                />
        );
    }
}
export default RegisterComponents;