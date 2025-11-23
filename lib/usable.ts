export const convertUtil = (data: any) => {
  const converting = data.map((index: any, key: number) => {
    return {
      id: key,
      value: index.id,
      label: `${convertName(index)}`,
    };
  });
  return converting;
};
export const convertName = (arg: any) => {
  return arg?.lastname[0] + "." + arg?.firstname;
};
export const capitalizeFirstLetter = (arg: any) => {
  return arg.charAt(0).toUpperCase() + arg.slice(1);
};
export const removeDepartment = (data: any) => {
  if (data && Array.isArray(data.departmentemployee)) {
    data.departmentemployee = data.departmentemployee.map((item: any) => {
      if (item.department) {
        const { department, ...rest } = item;
        return rest;
      }
      return item;
    });
  }
  return data;
};
export const parseLocaleNumber = (value: any): number => {
  return Number(String(value).replace(/[.\s]/g, ""));
};
export const parseGermanNumber = (str: string): number => {
  return parseFloat(str.replace(/\./g, "").replace(",", "."));
};
export const formatHumanReadable = (arg: string) => {
  return (
    arg.substring(0, 4) + "/" + arg.substring(5, 7) + "/" + arg.substring(8, 10)
  );
};
