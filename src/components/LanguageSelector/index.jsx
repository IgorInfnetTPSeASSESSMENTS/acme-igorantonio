import { useTranslation } from 'react-i18next';
import { Select, MenuItem, FormControl, styled } from '@mui/material';

// Estilização do Select com o styled
const StyledSelect = styled(Select)(({ theme }) => ({
  height: '30px',
  backgroundColor: 'white',
  '& .MuiSelect-icon': {
    color: theme.palette.text.primary, 
  },
  '&:hover': {
    backgroundColor: theme.palette.grey[100], 
  },
}));

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleChange = (event) => {
    const selectedLang = event.target.value;
    i18n.changeLanguage(selectedLang);
    localStorage.setItem('i18nextLng', selectedLang); 
  };

  return (
    <FormControl variant="outlined" sx={{ minWidth: 120 }}>
      <StyledSelect
        labelId="language-selector-label"
        value={i18n.language}
        onChange={handleChange}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="pt">Português</MenuItem>
      </StyledSelect>
    </FormControl>
  );
};

export default LanguageSelector;
