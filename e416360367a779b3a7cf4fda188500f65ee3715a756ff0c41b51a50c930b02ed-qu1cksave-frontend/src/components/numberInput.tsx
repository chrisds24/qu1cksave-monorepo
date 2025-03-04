import * as React from 'react';
import {
  Unstable_NumberInput as BaseNumberInput,
  NumberInputProps,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';
import { forwardRef, ForwardedRef, useState } from 'react';

// https://react.dev/learn/manipulating-the-dom-with-refs
// https://react.dev/reference/react/forwardRef
const NumberInput = forwardRef(function CustomNumberInput(
  props: NumberInputProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  // https://github.com/mui/material-ui/issues/39069
  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        incrementButton: {
          children: '▴',
          type: 'button',
        },
        decrementButton: {
          children: '▾',
          type: 'button',
        },
      }}
      {...props}
      ref={ref}
    />
  );
});

export default function NumberInputBasic(props: any) {
  const { inputType, numInputVal, setNumInputVal, min, max } = props;
  return (
    <NumberInput
      id={`${inputType} Input`}
      // name={`${inputType} Input`}
      aria-label={`${inputType} Input`}
      placeholder={inputType}
      value={numInputVal}
      onChange={(event, val) => setNumInputVal(val)}
      min={min}
      max={max}
    />
  );
}

const blue = {
  100: '#DAECFF',
  200: '#80BFFF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const StyledInputRoot = styled('div')(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  border-radius: 8px;
  color: #ffffff;
  background: #1e1e1e;
  border: 1.5px solid #636369;
  display: grid;
  grid-template-columns: 1fr 19px;
  grid-template-rows: 1fr 1fr;
  overflow: hidden;
  column-gap: 8px;
  padding: 4px;

  &.${numberInputClasses.focused} {
    border-color:  #000000;
  }

  &:hover {
    border-color: #000000;
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);

// Keeping this in case the MUI light blue color is wanted
// &.${numberInputClasses.focused} {
//   border-color:  #757de8;
// }

// &:hover {
//   border-color: #757de8;
// }

const StyledInputElement = styled('input')(
  ({ theme }) => `
  font-size: 16px;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  grid-column: 1/2;
  grid-row: 1/3;
  color: #ffffff;
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
`,
);

const StyledButton = styled('button')(
  ({ theme }) => `
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  appearance: none;
  padding: 0;
  width: 19px;
  height: 19px;
  font-family: system-ui, sans-serif;
  font-size: 0.875rem;
  line-height: 1;
  box-sizing: border-box;
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 0;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
    border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
    cursor: pointer;
  }

  &.${numberInputClasses.incrementButton} {
    grid-column: 2/3;
    grid-row: 1/2;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border: 1px solid;
    border-bottom: 0;
    &:hover {
      cursor: pointer;
      background: #5a5a5a;
      border-color: #5a5a5a;
      color: #ffffff;
    }

  border-color: #000000;
  background: #000000;
  color: #ffffff;
  }

  &.${numberInputClasses.decrementButton} {
    grid-column: 2/3;
    grid-row: 2/3;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border: 1px solid;
    &:hover {
      cursor: pointer;
      background: #5a5a5a;
      border-color: #5a5a5a;
      color: #ffffff;
    }

  border-color: #000000;
  background: #000000;
  color: #ffffff;
  }
  & .arrow {
    transform: translateY(-1px);
  }
`,
);

