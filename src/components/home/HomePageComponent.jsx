import { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import HomePage from "../../pages/HomePage";
import { db } from "../../firebaseConfig";

const HomePageComponent = () => {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const getJobs = async () => {
    try {
      // Only fetch approved jobs, or jobs without status (backward compatibility)
      const jobsQuery = query(
        collection(db, "jobs"),
        where("status", "in", ["active", "approved"])
      );

      // Also get jobs without status field (old data)
      const allJobsQuery = collection(db, "jobs");
      const querySnapshot = await getDocs(allJobsQuery);

      const jobsData = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((job) => {
          // Show jobs that are approved/active OR don't have a status field (old data)
          return !job.status || job.status === "active" || job.status === "approved";
        });

      setJobs(jobsData);
    } catch (error) {
      // Handle error silently in production
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <HomePage
      jobs={jobs}
      searchQuery={searchQuery}
      onSearch={handleSearch}
    />
  );
};

export default HomePageComponent;