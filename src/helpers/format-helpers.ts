export const sub = (substance: string): string => {
  return substance.split('').reduce((acc, curr, index, arr) => {
    if (Number(curr) && !Number(arr[index + 1]) && !Number(arr[index - 1])) {
      return acc + '<sub>' + curr + '</sub>';
    }

    if (Number(curr) && !Number(arr[index - 1])) {
      return acc + '<sub>' + curr;
    }

    if (Number(curr) && !Number(arr[index + 1])) {
      return acc + curr + '</sub>';
    }

    return acc + curr;
  }, '');
};

export const formatNmb = (value: number): string => {
  return value > 0 ? '+' + value : value.toString();
};

export const reverse = (str: string): string => {
  return (str + '').split('').reverse().join('');
};

export const replaceOne = (value: string): string => {
  return value === '1' ? '' : value;
};
