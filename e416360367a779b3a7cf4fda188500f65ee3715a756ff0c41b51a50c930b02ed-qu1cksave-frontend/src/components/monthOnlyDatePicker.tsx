import { DatePicker } from "@mui/x-date-pickers";

export default function MonthOnlyDatePicker(props: any) {
  const {id, name, val, setVal} = props;

  return (
    <DatePicker
      slotProps={{
        textField: {
          // id: 'savedMonthField',
          // name: 'savedMonthField',
          id: id,
          name: name,        
        },
        // https://stackoverflow.com/questions/74515452/mui-change-date-picker-header-elements-order
        calendarHeader: {
          sx: {
            "& .MuiPickersCalendarHeader-label": {
              display: 'none'
            }
          }
        },
        layout: {
          sx: {
            backgroundColor: '#000000',
            // "&.MuiPickersMonth-root.Mui-selected": {
            //   backgroundColor: "#4b4e50",
            //   borderColor: "#4b4e50",
            // },
            "& .MuiPickersMonth-monthButton": {
              color: '#ffffff',
              ":hover": {
                backgroundColor: "#262829",
                borderColor: "#262829",
              },
            },
            "& .MuiPickersMonth-monthButton.Mui-selected": {
              color: "#ffffff",
              backgroundColor: "#4b4e50",
              borderColor: "#4b4e50",
            },
          }
        }
      }}  
      sx={{
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
        }
      }}          
      label="Month"
      // value={savedMonthField}
      // onChange={(val) => setSavedMonthField(val)}
      value={val}
      onChange={(val) => setVal(val)}
      views={["month"]}
    />
  )
}