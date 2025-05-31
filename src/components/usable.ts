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
    case "DENY":
      return "Буцаагдсан";
    case "FORWARD":
      return "Хянагдсан";
    case "wait":
      return "Бүрэн бус";
    case "finish":
      return "Дууссан";
    case "CREATED":
      return "Үүссэн";
    case "STARTED":
      return "Эхэлсэн";
    case "ENDED":
      return "Дууссан";
    case "ACCESSER":
      return "Тестийн төсвийг хянан баталгаажуулах";
    case "VIEWER":
      return "Баримт бичгийг хянан баталгаажуулах";
    case "PERPAID":
      return "Урьдчилсан төлбөрт";
    case "POSTPAID":
      return "Дараа төлбөрт";
    default:
      return "Хянаагүй";
  }
};

export const roleConvert = (role: string) => {
  switch (role) {
    case "VIEWER":
      return "Хяналт тавих, Асуудал шийдвэрлэх";
    case "DEV":
      return "Техникийн нөхцөлөөр хангах";
    default:
      return "Төлөвлөгөө боловсруулах, Тест хийх";
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
      label: `${convertName(index)}`,
    };
  });
  return converting;
};

export const convertEmp = (data: any[]) => {
  const converting = data.map((index: any, key: number) => {
    return {
      id: key,
      value: index.id,
      label: `${convertName(index)}`,
    };
  });
  return converting;
};

export const convertNameOption = (data: string) => {
  return data.split(" ");
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

export const convertStatus = (arg: string) => {
  switch (arg) {
    case "HIGH":
      return "warning";
    case "MEDIUM":
      return "processing";
    default:
      return "success";
  }
};

export const mergeLetter = (letter: any) => {
  return letter?.firstname.substring(0, 1) + letter?.lastname.substring(0, 1);
};

export const subLetter = (arg: string) => {
  return arg.substring(0, 2).toUpperCase();
};

export const cleanArray = (arr: any) => {
  return arr
    .filter((item: any) => item !== undefined)
    .map((item: any) => {
      if (Array.isArray(item)) {
        return cleanArray(item);
      }
      return item;
    })
    .filter((item: any) => !Array.isArray(item) || item.length > 0);
};

export const checkreport = (arr: any) => {
  const mhn = arr.flatMap((item: any) => {
    if (!item.report || item.report.length === 0) {
      return [
        {
          firstname: item.firstname,
          jobPosition: item.jobPosition,
          hasReports: false,
        },
      ];
    }

    return item.report.map((reportItem: any) => ({
      firstname: item.firstname,
      jobPosition: item.jobPosition,
      hasReports: true,
      reportItem: reportItem,
    }));
  });
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

export const humanreadexception = (arg: boolean) => {
  if (arg === false) {
    return "Гараагүй";
  } else {
    return "Гарсан";
  }
};

export const humanreadphone = (arg: string) => {
  if (arg === "PERPAID") {
    return "Урьдчилсан төлбөрт";
  } else {
    return "Дараа төлбөрт";
  }
};

export const testcaselist = [
  {
    label: "System testing",
    value: "System testing",
  },
  { label: "UI testing", value: "UI testing" },
  {
    label: "Integration testing",
    value: "Integration testing",
  },
  {
    label: "Unit testing + Integration testing",
    value: "Unit testing + Integration testing",
  },
  {
    label: "Acceptance Testing + System Testing",
    value: "Acceptance Testing + System Testing",
  },
  {
    label: "Smoke Testing",
    value: "Smoke Testing",
  },
  {
    label: "Performance Testing",
    value: "Performance Testing",
  },
  {
    label: "Security Testing",
    value: "Security Testing",
  },
  {
    label: "Regression Testing",
    value: "Regression Testing",
  },
  {
    label: "Load Testing",
    value: "Load Testing",
  },
  {
    label: "Stress Testing",
    value: "Stress Testing",
  },
];
