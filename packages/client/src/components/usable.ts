export const mongollabel = (label: string) => {
  switch (label) {
    case "ACCESS":
      return "Зөвшөөрөгдсөн";
    case "FORWARD":
      return "Цохогдсон";
    case "wait":
      return "Дутуу";
    case "finish":
      return "Дууссан";
    case "process":
      return "Дууссан";
    default:
      return "Цуцлагдсан";
  }
};

export const formatHumanReadable = (arg: string) => {
  return (
    arg.substring(0, 4) + "/" + arg.substring(5, 7) + "/" + arg.substring(8, 10)
  );
};

export const convertName = (arg: any) => {
  return arg?.lastname[0] + "." + arg?.firstname;
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

export const capitalizeFirstLetter = (arg: any) => {
  return arg.charAt(0).toUpperCase() + arg.slice(1);
};

export const mergeLetter = (letter: any) => {
  return letter?.firstname.substring(0, 1) + letter?.lastname.substring(0, 1);
};
