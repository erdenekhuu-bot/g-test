export type ListDataType = {
  key: number;
  index: string;
  testname: any;
  order: string;
  employee: string;
  datetime: any;
  status: any;
};

export type ModalProps = {
  open: boolean;
  onCancel: () => void;
  confirmLoading?: boolean;
  onOk?: () => void;
  documentId?: number | null;
};

export type Detail = {
  id: number;
  title: string;
  generate: string;
  state: string;
  statement: string;
  authuserId: number;
  timeCreated: string;
  timeUpdated: string;
  isDeleted: boolean;
  userDataId: number | null;
  user: any | null;
  detail: any[];
  attribute: any[];
  budget: any[];
  riskassessment: any[];
  testcase: any[];
  documentemployee: any[];
  test: any[];
};
