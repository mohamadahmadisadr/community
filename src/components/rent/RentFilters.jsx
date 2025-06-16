import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Grid,
  TextField,
  MenuItem,
  Button,
  Slider
} from '@mui/material';

const RentFilters = ({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  PROPERTY_TYPES,
  RENTAL_CATEGORIES,
  CANADIAN_CITIES,
  CANADIAN_PROVINCES,
  FURNISHED_OPTIONS,
  PARKING_OPTIONS,
  PET_POLICIES
}) => {
  
  const handlePriceRangeChange = (event, newValue) => {
    onFilterChange('priceRange', newValue);
  };

  return (
    <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      
      {/* Property Type Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Property Type
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label="All Types"
            onClick={() => onFilterChange('type', '')}
            color={filters.type === '' ? 'primary' : 'default'}
            variant={filters.type === '' ? 'filled' : 'outlined'}
            sx={{ cursor: 'pointer' }}
          />
          {PROPERTY_TYPES.map((type) => (
            <Chip
              key={type.value}
              label={type.label}
              onClick={() => onFilterChange('type', type.value)}
              color={filters.type === type.value ? 'primary' : 'default'}
              variant={filters.type === type.value ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      {/* Category Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Category
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label="All Categories"
            onClick={() => onFilterChange('category', '')}
            color={filters.category === '' ? 'secondary' : 'default'}
            variant={filters.category === '' ? 'filled' : 'outlined'}
            sx={{ cursor: 'pointer' }}
          />
          {RENTAL_CATEGORIES.map((category) => (
            <Chip
              key={category.value}
              label={category.label}
              onClick={() => onFilterChange('category', category.value)}
              color={filters.category === category.value ? 'secondary' : 'default'}
              variant={filters.category === category.value ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      {/* Location Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            City
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={filters.city}
            onChange={(e) => onFilterChange('city', e.target.value)}
            placeholder="Select City"
          >
            <MenuItem value="">All Cities</MenuItem>
            {CANADIAN_CITIES.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Province
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={filters.province}
            onChange={(e) => onFilterChange('province', e.target.value)}
            placeholder="Select Province"
          >
            <MenuItem value="">All Provinces</MenuItem>
            {CANADIAN_PROVINCES.map((province) => (
              <MenuItem key={province} value={province}>
                {province}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Bedrooms */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Bedrooms
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label="Any"
            onClick={() => onFilterChange('bedrooms', '')}
            color={filters.bedrooms === '' ? 'primary' : 'default'}
            variant={filters.bedrooms === '' ? 'filled' : 'outlined'}
            sx={{ cursor: 'pointer' }}
          />
          <Chip
            label="Studio"
            onClick={() => onFilterChange('bedrooms', '0')}
            color={filters.bedrooms === '0' ? 'primary' : 'default'}
            variant={filters.bedrooms === '0' ? 'filled' : 'outlined'}
            sx={{ cursor: 'pointer' }}
          />
          {[1, 2, 3, 4].map((num) => (
            <Chip
              key={num}
              label={num === 4 ? '4+' : `${num}`}
              onClick={() => onFilterChange('bedrooms', num.toString())}
              color={filters.bedrooms === num.toString() ? 'primary' : 'default'}
              variant={filters.bedrooms === num.toString() ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      {/* Bathrooms */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
          Bathrooms
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label="Any"
            onClick={() => onFilterChange('bathrooms', '')}
            color={filters.bathrooms === '' ? 'primary' : 'default'}
            variant={filters.bathrooms === '' ? 'filled' : 'outlined'}
            sx={{ cursor: 'pointer' }}
          />
          {['1', '1.5', '2', '2.5', '3'].map((num) => (
            <Chip
              key={num}
              label={num === '3' ? '3+' : num}
              onClick={() => onFilterChange('bathrooms', num)}
              color={filters.bathrooms === num ? 'primary' : 'default'}
              variant={filters.bathrooms === num ? 'filled' : 'outlined'}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
          Price Range: ${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()}
        </Typography>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceRangeChange}
          valueLabelDisplay="auto"
          min={0}
          max={10000}
          step={100}
          marks={[
            { value: 0, label: '$0' },
            { value: 2500, label: '$2.5K' },
            { value: 5000, label: '$5K' },
            { value: 7500, label: '$7.5K' },
            { value: 10000, label: '$10K+' }
          ]}
          sx={{
            '& .MuiSlider-thumb': {
              bgcolor: 'primary.main'
            },
            '& .MuiSlider-track': {
              bgcolor: 'primary.main'
            }
          }}
        />
      </Box>

      {/* Additional Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Furnished
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={filters.furnished}
            onChange={(e) => onFilterChange('furnished', e.target.value)}
          >
            <MenuItem value="">Any</MenuItem>
            {FURNISHED_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Parking
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={filters.parking}
            onChange={(e) => onFilterChange('parking', e.target.value)}
          >
            <MenuItem value="">Any</MenuItem>
            {PARKING_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
            Pet Policy
          </Typography>
          <TextField
            select
            fullWidth
            size="small"
            value={filters.petPolicy}
            onChange={(e) => onFilterChange('petPolicy', e.target.value)}
          >
            <MenuItem value="">Any</MenuItem>
            {PET_POLICIES.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {/* Clear Filters Button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onClearFilters}
          sx={{ textTransform: 'none' }}
        >
          Clear All Filters
        </Button>
      </Box>
    </Box>
  );
};

export default RentFilters;
