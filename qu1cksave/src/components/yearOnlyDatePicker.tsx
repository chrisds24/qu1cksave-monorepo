import { DatePicker } from "@mui/x-date-pickers";

export default function YearOnlyDatePicker(props: any) {
  const {id, name, val, setVal} = props;

  return (
    // https://stackoverflow.com/questions/50556433/material-ui-datepicker-enable-only-year
    <DatePicker
      slotProps={{
        textField: {
          // id: 'savedYearField',
          // name: 'savedYearField',
          id: id,
          name: name,
        },
        layout: {
          sx: {
            backgroundColor: '#000000',
            // "&.MuiPickersYear-root.Mui-selected": {
            //   backgroundColor: "#4b4e50",
            //   borderColor: "#4b4e50",
            // },
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
        },
        marginRight: 2
      }}          
      label="Year"
      // value={savedYearField}
      // onChange={(val) => setSavedYearField(val)}
      value={val}
      onChange={(val) => setVal(val)}
      views={["year"]}
    />
  )
}