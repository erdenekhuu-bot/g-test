// let variable = "П.Өсөхбаяр";
// console.log(variable.substring(2));

// let data = "2025-02-06T08:45:54.902Z";
// console.log(data.substring(0, 10));

// console.log(
//   data.substring(0, 4) +
//     "/" +
//     data.substring(5, 7) +
//     "/" +
//     data.substring(8, 10)
// );

// let department = "Програм хөгжүүлэлтийн хэлтэс";
// console.log(
//   department
//     .split(" ")
//     .map((word) => word[0].toUpperCase())
//     .join("")
// );
let data = ["ХХ", "ПХХ", "ПХХ", "ГХГ", "ХХГ"];
let countMap = new Map();

data.forEach((item) => {
  if (countMap.has(item)) {
    countMap.set(item, countMap.get(item) + 1);
  } else {
    countMap.set(item, 1);
  }
});

const f1 = function (arg) {
  if (arg.length <= 1) {
    return "00" + arg;
  } else if (arg.length <= 2) {
    return "0" + arg;
  } else {
    return arg;
  }
};

let num = 69;
// console.log(f1(num.toString()));

const lett = {
  lastname: "Ренчиндорж",
  firstname: "Жаргал",
};

function trigger(arg) {
  // console.log(arg?.lastname[0]);
  // console.log(arg?.firstname);
  console.log(arg?.lastname[0] + "." + arg?.firstname);
}

const employee = [
  {
    id: 1,
    firstname: "Басбиш",
    lastname: "Дамба",
    jobPosition: {
      id: 159,
      departmentId: 2,
      jobGroupId: null,
      name: "Мэдээлэл технологийн газрын захирал",
      description: null,
      isDeleted: false,
      timeCreated: "2025-02-12T09:56:08.222Z",
    },
  },
  {
    id: 3,
    firstname: "Жаргал",
    lastname: "Ренчиндорж",
    jobPosition: {
      id: 159,
      departmentId: 2,
      jobGroupId: null,
      name: "Мэдээлэл технологийн газрын захирал",
      description: null,
      isDeleted: false,
      timeCreated: "2025-02-12T09:56:08.222Z",
    },
  },
  {
    id: 4,
    firstname: "Жаргал",
    lastname: "Ренчиндорж",
    jobPosition: {
      id: 7,
      departmentId: 20,
      jobGroupId: null,
      name: "Дарга",
      description: null,
      isDeleted: false,
      timeCreated: "2025-02-12T09:56:07.970Z",
    },
  },
  {
    id: 8,
    firstname: "Хулангоо",
    lastname: "Батдуулга",
    jobPosition: {
      id: 13,
      departmentId: 9,
      jobGroupId: null,
      name: "Биллингийн инженер",
      description: null,
      isDeleted: false,
      timeCreated: "2025-02-12T09:56:07.981Z",
    },
  },
  {
    id: 13,
    firstname: "Цэцэг-Очир",
    lastname: "Ц",
    jobPosition: {
      id: 3,
      departmentId: 16,
      jobGroupId: null,
      name: "ХАГ Захирал",
      description: null,
      isDeleted: false,
      timeCreated: "2025-02-12T09:56:07.961Z",
    },
  },
  {
    id: 15,
    firstname: "Өнөрбат",
    lastname: "Энхтөр",
    jobPosition: {
      id: 131,
      departmentId: 54,
      jobGroupId: null,
      name: "Хэлтсийн дарга",
      description: null,
      isDeleted: false,
      timeCreated: "2025-02-12T09:56:08.177Z",
    },
  },
  {
    id: 16,
    firstname: "Номундарь",
    lastname: "Энхболд",
    jobPosition: {
      id: 66,
      departmentId: 9,
      jobGroupId: null,
      name: "Инженер",
      description: null,
      isDeleted: false,
      timeCreated: "2025-02-12T09:56:08.067Z",
    },
  },
];

function trigger() {
  const mhn = employee.find((item) => item.jobPosition.id === 131);
  return mhn.jobPosition.departmentId;
}

let converting = {
  value: "1",
  label: "Not Identified",
};

employee.map((index) => {
  return {
    value: index.id,
    label: index.firstname,
  };
});

let employeeResult = employee.find((item) => {
  return item.id === 16;
});

let job = employee.map((item) => {
  return {
    value: item.id,
    label: item.jobPosition.name,
  };
});

const datas = {
  names: [null, 44],
  employee: [null, 606],
  roles: [null, "admin"],
};

const steps =
  "1. Lorem ipsum dolor sit amet consectetur adipisicing elit.\n2. Lorem ipsum dolor sit amet consectetur adipisicing elit.\n3. Lorem ipsum dolor sit amet consectetur adipisicing elit.\n4. Lorem ipsum dolor sit amet consectetur adipisicing elit.\n5. Lorem ipsum dolor sit amet consectetur adipisicing elit.\n6. Lorem ipsum dolor sit amet consectetur adipisicing elit.\n7. Lorem ipsum dolor sit amet consectetur adipisicing elit.\n8. Lorem ipsum dolor sit amet consectetur adipisicing elit.\n";

const formattedSteps = steps.replace(/(?=\d+\.)/g, "\n");

const findemp = {
  user: {
    employee: {
      firstname: "Цэцэгсайхан",
      lastname: "Дуламрагчаа",
    },
  },
};

const fn = findemp.user.employee.firstname;
const sn = findemp.user.employee.lastname;

function lss(arg) {
  let arg1 = arg.user.employee.firstname;
  let arg2 = arg.user.employee.lastname;
  return arg1.substring(0, 1) + arg2.substring(0, 1);
}

let sample = [undefined, "admin", "view", "boss"];
let sslos = [
  "2025-02-12T08:00:00.000Z",
  "2025-02-07T08:00:00.000Z",
  "2025-02-23T08:00:00.000Z",
  "2025-02-28T08:00:00.000Z",
];

const loooos = [
  {
    id: 1,
    title: "ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    generate: "001-ТӨ-МТГ",
    state: "FORWARD",
    statement: null,
    authUserId: 1,
    userDataId: null,
    timeCreated: "2025-03-07T09:52:01.357Z",
    timeUpdated: "2025-03-07T12:07:23.952Z",
    isDeleted: false,
    isFull: 0,
    user: {
      employee: {
        firstname: "Жаргал",
        lastname: "Ренчиндорж",
      },
    },
  },
  {
    id: 3,
    title: "aspernatur aut odit aut fugit",
    generate: "002-ТӨ-МТГ",
    state: "DENY",
    statement: null,
    authUserId: 1,
    userDataId: null,
    timeCreated: "2025-03-07T10:29:25.823Z",
    timeUpdated: "2025-03-07T12:03:32.243Z",
    isDeleted: false,
    isFull: 0,
    user: {
      employee: {
        firstname: "Жаргал",
        lastname: "Ренчиндорж",
      },
    },
  },
];
let mine = [
  {
    id: 1,
    title: "New erp",
    generate: "001-ТӨ-МТГ",
    state: "DENY",
    statement: null,
    authUserId: 1,
    userDataId: null,
    timeCreated: "2025-03-10T00:35:48.996Z",
    timeUpdated: "2025-03-10T05:17:12.411Z",
    isDeleted: false,
    isFull: 1,
    user: {
      employee: {
        firstname: "Жаргал",
        lastname: "Ренчиндорж",
      },
    },
  },
  {
    id: 2,
    title: "   Lorem ipsum dolor sit amet.",
    generate: "002-ТӨ-МТГ",
    state: "FORWARD",
    statement: null,
    authUserId: 1,
    userDataId: null,
    timeCreated: "2025-03-10T05:13:49.289Z",
    timeUpdated: "2025-03-10T05:17:01.098Z",
    isDeleted: false,
    isFull: 1,
    user: {
      employee: {
        firstname: "Жаргал",
        lastname: "Ренчиндорж",
      },
    },
  },
  {
    id: 3,
    title: "Lorem ipsum dolor sit amet consectetur.",
    generate: "003-ТӨ-МТГ",
    state: "DENY",
    statement: null,
    authUserId: 1,
    userDataId: null,
    timeCreated: "2025-03-10T05:30:38.795Z",
    timeUpdated: "2025-03-10T05:48:21.167Z",
    isDeleted: false,
    isFull: 1,
    user: {
      employee: {
        firstname: "Жаргал",
        lastname: "Ренчиндорж",
      },
    },
  },
  {
    id: 4,
    title: "Lorem ipsum dolor sit amet consectetur.",
    generate: "004-ТӨ-МТГ",
    state: "DENY",
    statement: null,
    authUserId: 1,
    userDataId: null,
    timeCreated: "2025-03-10T05:33:56.350Z",
    timeUpdated: "2025-03-10T05:34:52.461Z",
    isDeleted: false,
    isFull: 1,
    user: {
      employee: {
        firstname: "Жаргал",
        lastname: "Ренчиндорж",
      },
    },
  },
  {
    id: 5,
    title: "Lorem ipsum dolor sit amet consectetur.",
    generate: "005-ТӨ-МТГ",
    state: "DENY",
    statement: null,
    authUserId: 1,
    userDataId: null,
    timeCreated: "2025-03-10T05:46:51.715Z",
    timeUpdated: "2025-03-10T05:47:39.552Z",
    isDeleted: false,
    isFull: 1,
    user: {
      employee: {
        firstname: "Жаргал",
        lastname: "Ренчиндорж",
      },
    },
  },
];
// console.log(mine.filter((item) => item.state === "FORWARD"));
let name = "Хэлтсийн дарга";
console.log(name.includes("дарга"));
