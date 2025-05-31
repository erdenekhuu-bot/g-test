"use client";
import Image from "next/image";
import { Form, Table, Button, Select, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import axios from "axios";
import { convertUtil } from "@/components/usable";

interface DataType {
  key: number;
  id: number;
  employee: any;
  jobPosition: any;
  role: string;
}

export function EditDepartmentEmployee({ documentId }: any) {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [getEmployee, setEmployee] = useState<any[]>([]);

  const detail = async ({ id }: { id: any }) => {
    try {
      setLoading(true);
      const request = await axios.get(`/api/document/detail/${id}`);
      if (request.data.success) {
        const updatedData = request.data.data.departmentEmployeeRole.map(
          (data: any) => ({
            key: data.employee.id,
            id: data.employee.id,
            department: data.employee.department?.name,
            employee: data.employee.firstname + " " + data.employee.lastname,
            role: data.role,
          })
        );

        setDataSource(updatedData);
      }
    } catch (error) {}
  };

  const fetchEmployees = async (searchValue: string) => {
    try {
      const response = await axios.post("/api/employee", {
        firstname: searchValue || "",
      });
      if (response.data.success) {
        setEmployee(response.data.data);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (documentId) {
      detail({ id: documentId });
    }
  }, [documentId]);

  useEffect(() => {
    if (search.length > 0) {
      fetchEmployees(search);
    } else {
      setEmployee([]);
    }
  }, [search]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        if (!search.trim()) {
          setEmployee([]);
          return;
        }

        const response = await axios.post("/api/employee", {
          firstname: search,
        });

        if (response.data.success) {
          setEmployee(response.data.data);
        }
      } catch (error) {}
    };

    const delayDebounce = setTimeout(() => {
      fetchEmployees();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleAdd = () => {
    const newKey = Math.max(0, ...dataSource.map((item) => item.key)) + 1;
    const newData: DataType = {
      key: newKey,
      id: newKey,
      employee: "",
      jobPosition: "",
      role: "",
    };
    setDataSource([...dataSource, newData]);
  };

  const handleDelete = (key: number) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "Нэр",
      dataIndex: "employee",
      key: "employee",
      render: (_, record, index) => (
        <Form.Item
          name={["departmentemployee", index, "employeeId"]}
          initialValue={record.employee}
          style={{ margin: 0 }}
        >
          <Select
            showSearch
            allowClear
            style={{ width: "100%" }}
            placeholder="Ажилтан хайх..."
            options={convertUtil(getEmployee)}
            onSearch={(value) => setSearch(value)}
            filterOption={false}
          />
        </Form.Item>
      ),
    },
    {
      title: "Албан тушаал",
      dataIndex: "jobPosition",
      key: "jobPosition",
      width: 300,
      render: (_, record, index) => (
        <Form.Item
          name={["key", index, "jobposition"]}
          initialValue={record.jobPosition}
          style={{ margin: 0 }}
        >
          <Input placeholder="" readOnly />
        </Form.Item>
      ),
    },
    {
      title: "Үүрэг",
      dataIndex: "role",
      key: "role",
      render: (_, record, index) => (
        <Form.Item
          name={["departmentemployee", index, "role"]}
          initialValue={record.role}
        >
          <Select
            tokenSeparators={[","]}
            style={{ marginTop: 18 }}
            options={[
              {
                value: "ACCESSER",
                label: "Баталгаажуулагч",
              },
              {
                value: "VIEWER",
                label: "Хянагч",
              },
            ]}
          />
        </Form.Item>
      ),
    },
    {
      title: "",
      key: "id",
      render: (_, record) => (
        <Image
          src="/trash.svg"
          alt=""
          className="hover:cursor-pointer"
          width={20}
          height={20}
          onClick={() => handleDelete(record.key)}
        />
      ),
    },
  ];

  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
      />
      <div className="text-end mt-4">
        <Button type="primary" onClick={handleAdd}>
          Мөр нэмэх
        </Button>
      </div>
    </div>
  );
}
