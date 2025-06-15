import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Switch,
  Divider,
  Alert,
  Chip
} from "@mui/material";
import { ArrowBack, Add, Remove } from "@mui/icons-material";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const AddJobPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Basic Job Information
    title: "",
    description: "",
    company: "",
    category: "",
    type: "",

    // Location Information
    city: "",
    province: "",
    remote: false,

    // Salary Information
    salaryMin: "",
    salaryMax: "",
    currency: "CAD",
    period: "yearly",

    // Contact Information
    contactEmail: "",
    contactPhone: "",
    applicationUrl: "",

    // Job Requirements and Benefits
    requirements: [],
    benefits: [],

    // Optional fields
    expiryDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [currentRequirement, setCurrentRequirement] = useState("");
  const [currentBenefit, setCurrentBenefit] = useState("");

  // From JOBS_DATABASE_STRUCTURE.md
  const jobCategories = [
    "Technology",
    "Healthcare",
    "Education",
    "Finance",
    "Engineering",
    "Marketing",
    "Sales",
    "Customer Service",
    "Administration",
    "Construction",
    "Transportation",
    "Food Service",
    "Retail",
    "Other"
  ];

  const jobTypes = [
    "full-time",
    "part-time",
    "contract",
    "internship",
    "temporary",
    "freelance"
  ];

  const cities = [
    "Toronto",
    "Montreal",
    "Vancouver",
    "Calgary",
    "Edmonton",
    "Ottawa",
    "Winnipeg",
    "Quebec City",
    "Hamilton",
    "Kitchener",
    "London",
    "Victoria",
    "Halifax",
    "Oshawa",
    "Windsor",
    "Saskatoon",
    "Regina",
    "Sherbrooke",
    "St. Johns",
    "Barrie"
  ];

  const provinces = [
    "Alberta",
    "British Columbia",
    "Manitoba",
    "New Brunswick",
    "Newfoundland and Labrador",
    "Northwest Territories",
    "Nova Scotia",
    "Nunavut",
    "Ontario",
    "Prince Edward Island",
    "Quebec",
    "Saskatchewan",
    "Yukon"
  ];

  const salaryPeriods = [
    "yearly",
    "monthly",
    "weekly",
    "daily",
    "hourly"
  ];

  const currencies = [
    "CAD",
    "USD",
    "EUR",
    "GBP"
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const addRequirement = () => {
    if (currentRequirement.trim() && !formData.requirements.includes(currentRequirement.trim())) {
      setFormData({
        ...formData,
        requirements: [...formData.requirements, currentRequirement.trim()]
      });
      setCurrentRequirement("");
    }
  };

  const removeRequirement = (index) => {
    setFormData({
      ...formData,
      requirements: formData.requirements.filter((_, i) => i !== index)
    });
  };

  const addBenefit = () => {
    if (currentBenefit.trim() && !formData.benefits.includes(currentBenefit.trim())) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, currentBenefit.trim()]
      });
      setCurrentBenefit("");
    }
  };

  const removeBenefit = (index) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index)
    });
  };

  const validateForm = () => {
    const errors = [];

    // Required fields validation
    if (!formData.title || formData.title.length < 3) {
      errors.push('Job title must be at least 3 characters long');
    }

    if (!formData.description || formData.description.length < 10) {
      errors.push('Job description must be at least 10 characters long');
    }

    if (!formData.company) {
      errors.push('Company name is required');
    }

    if (!formData.category) {
      errors.push('Job category is required');
    }

    if (!formData.type) {
      errors.push('Job type is required');
    }

    if (!formData.city) {
      errors.push('City is required');
    }

    if (!formData.province) {
      errors.push('Province is required');
    }

    if (!formData.contactEmail) {
      errors.push('Contact email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.contactEmail)) {
        errors.push('Please enter a valid email address');
      }
    }

    // Optional validations
    if (formData.salaryMin && isNaN(formData.salaryMin)) {
      errors.push('Minimum salary must be a valid number');
    }

    if (formData.salaryMax && isNaN(formData.salaryMax)) {
      errors.push('Maximum salary must be a valid number');
    }

    if (formData.salaryMin && formData.salaryMax) {
      const min = parseFloat(formData.salaryMin);
      const max = parseFloat(formData.salaryMax);
      if (max < min) {
        errors.push('Maximum salary must be greater than or equal to minimum salary');
      }
    }

    if (formData.applicationUrl) {
      try {
        new URL(formData.applicationUrl);
      } catch {
        errors.push('Please enter a valid URL for application link');
      }
    }

    if (formData.expiryDate) {
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expiryDate <= today) {
        errors.push('Expiry date must be in the future');
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n\n' + validationErrors.join('\n'));
      return;
    }

    setLoading(true);

    try {
      // Prepare the job data according to JOBS_DATABASE_STRUCTURE.md
      const jobData = {
        // Basic Job Information
        title: formData.title,
        description: formData.description,
        company: formData.company,
        category: formData.category,
        type: formData.type,

        // Location Information
        location: {
          city: formData.city,
          province: formData.province,
          remote: formData.remote
        },

        // Salary Information
        salary: {
          min: formData.salaryMin ? parseFloat(formData.salaryMin) : null,
          max: formData.salaryMax ? parseFloat(formData.salaryMax) : null,
          currency: formData.currency,
          period: formData.period
        },

        // Job Requirements and Benefits
        requirements: formData.requirements,
        benefits: formData.benefits,

        // Contact Information
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone || "",
        applicationUrl: formData.applicationUrl || "",

        // Status and Settings
        status: "pending", // Requires admin approval
        featured: false,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,

        // Metadata
        userId: "anonymous", // Will be updated when user auth is implemented
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, "jobs"), jobData);

      alert("Job submitted successfully! It will be visible after admin approval.");
      navigate('/jobs');
    } catch (error) {
      console.error('Error adding job:', error);
      alert("Failed to add job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ pt: 2, pb: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/jobs')} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Post New Job
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Basic Job Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Basic Information
          </Typography>

          <TextField
            fullWidth
            label="Job Title *"
            name="title"
            value={formData.title}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
            helperText="Minimum 3 characters"
          />

          <TextField
            fullWidth
            label="Job Description *"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            sx={{ mb: 2 }}
            required
            helperText="Minimum 10 characters"
          />

          <TextField
            fullWidth
            label="Company Name *"
            name="company"
            value={formData.company}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
            placeholder="e.g., TechCorp Solutions"
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl sx={{ flex: 1 }} required>
              <InputLabel>Job Category *</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Job Category *"
              >
                {jobCategories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ flex: 1 }} required>
              <InputLabel>Job Type *</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Job Type *"
              >
                {jobTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Location Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Location
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl sx={{ flex: 1 }} required>
              <InputLabel>City *</InputLabel>
              <Select
                name="city"
                value={formData.city}
                onChange={handleChange}
                label="City *"
              >
                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ flex: 1 }} required>
              <InputLabel>Province *</InputLabel>
              <Select
                name="province"
                value={formData.province}
                onChange={handleChange}
                label="Province *"
              >
                {provinces.map((province) => (
                  <MenuItem key={province} value={province}>
                    {province}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={formData.remote}
                onChange={handleChange}
                name="remote"
                color="primary"
              />
            }
            label="Remote work available"
            sx={{ mb: 3 }}
          />

          <Divider sx={{ my: 3 }} />

          {/* Salary Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Salary Information
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Minimum Salary"
              name="salaryMin"
              type="number"
              value={formData.salaryMin}
              onChange={handleChange}
              sx={{ flex: 1 }}
              placeholder="50000"
              helperText="Optional"
            />
            <TextField
              label="Maximum Salary"
              name="salaryMax"
              type="number"
              value={formData.salaryMax}
              onChange={handleChange}
              sx={{ flex: 1 }}
              placeholder="80000"
              helperText="Optional"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Currency</InputLabel>
              <Select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                label="Currency"
              >
                {currencies.map((currency) => (
                  <MenuItem key={currency} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Salary Period</InputLabel>
              <Select
                name="period"
                value={formData.period}
                onChange={handleChange}
                label="Salary Period"
              >
                {salaryPeriods.map((period) => (
                  <MenuItem key={period} value={period}>
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Contact Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Contact Information
          </Typography>

          <TextField
            fullWidth
            label="Contact Email *"
            name="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
            placeholder="hr@company.com"
            helperText="This email will be displayed for applications"
          />

          <TextField
            fullWidth
            label="Contact Phone"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            sx={{ mb: 2 }}
            placeholder="+1-416-555-0123"
            helperText="Optional"
          />

          <TextField
            fullWidth
            label="Application URL"
            name="applicationUrl"
            value={formData.applicationUrl}
            onChange={handleChange}
            sx={{ mb: 3 }}
            placeholder="https://company.com/careers/apply"
            helperText="Optional - External application link"
          />

          <Divider sx={{ my: 3 }} />

          {/* Job Requirements */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Job Requirements
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              label="Add Requirement"
              value={currentRequirement}
              onChange={(e) => setCurrentRequirement(e.target.value)}
              placeholder="e.g., Bachelor's degree in Computer Science"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addRequirement();
                }
              }}
            />
            <Button
              variant="outlined"
              onClick={addRequirement}
              disabled={!currentRequirement.trim()}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <Add />
            </Button>
          </Box>

          {formData.requirements.length > 0 && (
            <Box sx={{ mb: 3 }}>
              {formData.requirements.map((requirement, index) => (
                <Chip
                  key={index}
                  label={requirement}
                  onDelete={() => removeRequirement(index)}
                  deleteIcon={<Remove />}
                  sx={{ mr: 1, mb: 1 }}
                  variant="outlined"
                />
              ))}
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Job Benefits */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Job Benefits
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              label="Add Benefit"
              value={currentBenefit}
              onChange={(e) => setCurrentBenefit(e.target.value)}
              placeholder="e.g., Health insurance"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addBenefit();
                }
              }}
            />
            <Button
              variant="outlined"
              onClick={addBenefit}
              disabled={!currentBenefit.trim()}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              <Add />
            </Button>
          </Box>

          {formData.benefits.length > 0 && (
            <Box sx={{ mb: 3 }}>
              {formData.benefits.map((benefit, index) => (
                <Chip
                  key={index}
                  label={benefit}
                  onDelete={() => removeBenefit(index)}
                  deleteIcon={<Remove />}
                  sx={{ mr: 1, mb: 1 }}
                  variant="outlined"
                  color="secondary"
                />
              ))}
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Optional Information */}
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Additional Information
          </Typography>

          <TextField
            fullWidth
            label="Job Expiry Date"
            name="expiryDate"
            type="date"
            value={formData.expiryDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 3 }}
            helperText="Optional - When this job posting should expire"
          />

          <Alert severity="info" sx={{ mb: 3 }}>
            Your job will be submitted for review and will be visible to the public once approved by an administrator.
          </Alert>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.5,
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            {loading ? "Posting Job..." : "Submit Job for Review"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddJobPage;