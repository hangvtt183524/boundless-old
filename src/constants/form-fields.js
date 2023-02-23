export const POSITIVE_INTEGER_FORBIDDEN_CHARACTERS = ['-', '\\+', '\\.', ',', 'e', 'E']
export const POSITIVE_NUMBER_FORBIDDEN_CHARACTERS = ['-', '\\+', 'e', 'E']

export const PORT_INPUT_PROPS = {
  type: 'number',
  min: 1,
  max: 65535,
  forbiddenCharacters: POSITIVE_INTEGER_FORBIDDEN_CHARACTERS
}

export const VLAN_INPUT_PROPS = {
  type: 'number',
  min: 1,
  max: 4094,
  forbiddenCharacters: POSITIVE_INTEGER_FORBIDDEN_CHARACTERS
}

export const POSITIVE_NUMBER_INPUT_PROPS = {
  type: 'number',
  min: 0,
  forbiddenCharacters: POSITIVE_NUMBER_FORBIDDEN_CHARACTERS
}

export const POSITIVE_INTEGER_INPUT_PROPS = {
  type: 'number',
  min: 0,
  forbiddenCharacters: POSITIVE_INTEGER_FORBIDDEN_CHARACTERS
}
