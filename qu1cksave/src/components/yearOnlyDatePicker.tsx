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