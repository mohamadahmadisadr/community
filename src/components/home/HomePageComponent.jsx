import React from "react";
import { collection, getDocs } from "firebase/firestore";
import HomePage from "../../pages/HomePage";
import { db } from "../../firebaseConfig";

class HomePageComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      searchQuery: "", // State for search input
    };
  }

  getJobs = async () => {
    const querySnapshot = await getDocs(collection(db, "jobs"));
    const jobs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    this.setState({ jobs });
  };

  async componentDidMount() {
    this.getJobs();
  }

  handleSearch = (query) => {
    this.setState({ searchQuery: query });
  };

  render() {
    return (
      <HomePage
        jobs={this.state.jobs}
        searchQuery={this.state.searchQuery}
        onSearch={this.handleSearch}
      />
    );
  }
}

export default HomePageComponent;