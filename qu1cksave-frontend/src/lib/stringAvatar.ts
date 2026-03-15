import { split } from "firebase/firestore/pipelines";

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export default function stringAvatar(name: string) {
  // Refer to validateName from lib/signupValidations.ts for notes on how
  //   names would be
  const splitName = name.split(' ');
  let secondWord;
  // First and last word guaranteed non-empty
  for (let i = 1; i < splitName.length; i++) {
    // Second word will be the first non-empty word after the first word
    if (splitName[i] === '') {
      continue;
    } else {
      secondWord = splitName[i];
    }
  }

  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${splitName[0][0] + secondWord![0]}`,
    // children: `${splitName.length >= 2 ?
    //   splitName[0][0] + splitName[1][0] :
    //   splitName[0][0]
    // }`,
  };
}