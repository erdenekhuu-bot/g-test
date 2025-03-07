export const filterDepartment = (department: any) => {
  return department
    .split(" ")
    .map((word: string) => word[0].toUpperCase())
    .join("");
};

export const mongollabel = (label: string) => {
  switch (label) {
    case "ACCESS":
      return "Зөвшөөрөгдсөн";
    case "FORWARD":
      return "Хянагдсан";
    case "wait":
      return "Бүрэн бус";
    case "finish":
      return "Дууссан";
    default:
      return "Цуцлагдсан";
  }
};

export const convertName = (arg: any) => {
  return arg?.lastname[0] + "." + arg?.firstname;
};

export const formatHumanReadable = (arg: string) => {
  return (
    arg.substring(0, 4) + "/" + arg.substring(5, 7) + "/" + arg.substring(8, 10)
  );
};

export const convertUtil = (data: any[]) => {
  const converting = data.map((index: any, key: number) => {
    return {
      id: key,
      value: index.id,
      label: index.firstname,
    };
  });
  return converting;
};

export const capitalizeFirstLetter = (arg: any) => {
  return arg.charAt(0).toUpperCase() + arg.slice(1);
};

export const selectConvert = (arg: number) => {
  switch (arg) {
    case 1:
      return "HIGH";
    case 2:
      return "MEDIUM";
    case 3:
      return "LOW";
    default:
      return "LOW";
  }
};
