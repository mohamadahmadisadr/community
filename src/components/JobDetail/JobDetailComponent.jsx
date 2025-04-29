import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Container, Typography, Box, Button, CircularProgress, Stack } from "@mui/material";
import Header from "../../pages/MyHeader";
import Footer from "../../pages/MyFooter";
import { db } from "../../firebaseConfig"; // Adjust the path to your Firebase config file

const JobDetailPage = () => {
  const { id } = useParams(); // Get the job ID from the URL
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobDoc = await getDoc(doc(db, "jobs", id)); // Fetch job by ID from Firestore
        if (jobDoc.exists()) {
          setJob({ id: jobDoc.id, ...jobDoc.data() });
        } else {
          console.error("Job not found");
        }
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  // Helper function to determine text direction
  const getTextDirection = (text) => {
    const persianRegex = /[\u0600-\u06FF]/; // Matches Persian/Arabic characters
    return persianRegex.test(text) ? "rtl" : "ltr";
  };

  // Helper function to determine font family
  const getFontFamily = (text) => {
    const persianRegex = /[\u0600-\u06FF]/; // Matches Persian/Arabic characters
    return persianRegex.test(text) ? "'Vazir', sans-serif" : "'Roboto', sans-serif";
  };

  const handleApply = () => {
    window.open(job.link, "_blank", "noopener,noreferrer"); // Open the job link in a new tab
  };

  const handleShare = () => {
    const jobUrl = `${window.location.origin}/job/${id}`;
    navigator.clipboard.writeText(jobUrl).then(() => {
      alert("Job link copied to clipboard!");
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <Container
          sx={{
            mt: 10,
            mb: 8,
            textAlign: "center",
          }}
        >
          <CircularProgress />
        </Container>
        <Footer />
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Header />
        <Container
          sx={{
            mt: 10,
            mb: 8,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" color="error">
            Job not found.
          </Typography>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container
        sx={{
          mt: 10,
          mb: 8,
          textAlign: "center",
        }}
      >
        <Box
          component="img"
          src={job.image}
          alt={job.title}
          sx={{
            width: "100%",
            maxHeight: 400,
            objectFit: "cover",
            borderRadius: 2,
            mb: 4,
          }}
        />
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 2,
            textAlign: getTextDirection(job.title) === "rtl" ? "right" : "left",
            fontFamily: getFontFamily(job.title),
          }}
        >
          {job.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 4,
            lineHeight: 1.8,
            color: "text.secondary",
            textAlign: getTextDirection(job.description) === "rtl" ? "right" : "left",
            fontFamily: getFontFamily(job.description),
            whiteSpace: "pre-line", // Preserve newlines
          }}
        >
          {job.description}
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          {job.link && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleApply}
              sx={{
                py: 1.5,
                px: 4,
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Apply Now
            </Button>
          )}
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleShare}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Share
          </Button>
        </Stack>
      </Container>
      <Footer />
    </>
  );
};

export default JobDetailPage;