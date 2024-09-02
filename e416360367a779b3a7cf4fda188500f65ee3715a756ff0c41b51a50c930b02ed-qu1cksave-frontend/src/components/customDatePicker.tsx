import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function CustomDatePicker(props: any) {
  const {
    pickerType,
    err,
    setErr,
    val,
    changeVal,
  } = props;

  return (
    <DatePicker
      // Source:
      // https://stackoverflow.com/questions/76767152/i-am-using-react-mui-mui-x-date-pickers-please-tell-me-how-to-change-color-of
      // https://stackoverflow.com/questions/74733138/unable-to-assign-name-or-id-to-datepicker-component-for-the-purpose-of-yup-valid 
      slotProps={{
        textField: {
          id: `${pickerType === 'applied' ? 'applied': 'posted'}`,
          name: `${pickerType === 'applied' ? 'applied': 'posted'}`,
          helperText: err ? 'Please fill in day, month, and year.' : ''
        },
        layout: {
          sx: {
            backgroundColor: '#000000',
            '& .MuiDayCalendar-weekDayLabel': {
              color: '#808080',
              fontWeight: 'bold'
            },
            "&.MuiPickersYear-root.Mui-selected": {
              backgroundColor: "#4b4e50",
              borderColor: "#4b4e50",
            },
            "& .MuiPickersYear-yearButton": {
              color: '#ffffff',
              ":hover": {
                backgroundColor: "#262829",
                borderColor: "#262829",
              },
            },
            "& .MuiPickersYear-yearButton.Mui-selected": {
              color: "#ffffff",
              backgroundColor: "#4b4e50",
              borderColor: "#4b4e50",
            },
            "& .MuiPickersArrowSwitcher-button": {
              color: '#ffffff',
              ":hover": {
                backgroundColor: "#262829",
                borderColor: "#262829",
              },
            },
          }
        },
        calendarHeader: { sx: { color: '#ffffff', fontWeight: 'bold' } },
        switchViewButton: {
          sx: {
            color: '#ffffff',
            ":hover": {
              backgroundColor: "#262829",
              borderColor: "#262829",
              borderRadius: '50%'
            }
          }
        },
        day: {
          sx: {
            color: '#ffffff',
            "&.MuiPickersDay-root.Mui-selected": {
              backgroundColor: "#4b4e50",
              borderColor: "#4b4e50",
            },
            "&.MuiPickersDay-today": {
              borderColor: "#4b4e50",
              backgroundColor: "#000000"
            },
            ":hover": {
              backgroundColor: "#262829",
              borderColor: "#262829",
            }
          },
        },
      }}     
      sx={{
        marginRight: 2,
        input: {
          color: '#ffffff'
        },
        "& .MuiOutlinedInput-notchedOutline": {
          border: 'solid #636369',
        },
        "& label": {
          color: '#636369',
        },
        "& .MuiButtonBase-root": {
          color: '#636369',
        },
      }}
      label={`${pickerType === 'applied' ? 'Date Applied': 'Date Posted'}`}
      // https://stackoverflow.com/questions/75334255/how-to-convert-the-input-date-value-of-mui-datepicker
      value={val}
      onChange={changeVal}
      onError={(newError) => setErr(newError)}
    />
  );
}