const separateNumberWithCommas = (x: string | number): string => x?.toString()?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export default separateNumberWithCommas;