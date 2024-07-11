import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Modal } from "antd";
import { systemController } from "../../apiServices";
import {
  Box,
  Container,
  Input,
  Label,
  Table,
  Modal as ModalCustom,
  Button,
  Icons
} from "../../components";
import { isValidResponse } from "../../helpers";
import { loadingAction } from "../../actions";
import { THEME } from "../../themes";

const AllInsurance = () => {
  const dispatch = useDispatch();
  const [dataList, setDataList] = useState([]);
  const [search, setSearch] = useState("");
  const [cancelQuoNum, setCancelQuoNum] = useState("");
  const [reason, setReason] = useState("");
  const modal = useRef(null);

  const fetchData = useCallback(async () => {
    const API = systemController();
    const res = await API.getAllInsuranceVif();
    if (isValidResponse(res)) {
      const { result } = res;
      const dataList = result.map((e, i) => {
        return {
          key: i,
          no: i + 1,
          cuscode: e.id_cus,
          name: e.name,
          quo_num: e.quo_num,
          datestart: e.datestart,
          idCar: e.idcar,
        };
      });
      setDataList(dataList);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const data = dataList.filter(
    (e) =>
      e.cuscode.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
      e.quo_num.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
      e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
      e.idCar.toLowerCase().indexOf(search.toLowerCase()) !== -1
  );

  const handleClickCancel = async () => {
    if (!reason || reason.trim().length === 0) {
      Modal.error({ title: "กรุณาระบุเหตุผลการขอยกเลิกกรมธรรม์" });
    } else {
      dispatch(loadingAction(true));
      const params = { quo_num: cancelQuoNum, reason };
      const API = systemController();
      const res = await API.cancelInsuranceVif(params);
      if (isValidResponse(res)) {
        dispatch(loadingAction(false));
        Modal.success({
          title: "แจ้งยกเลิกสำเร็จ",
          content: "กรุณารอเจ้าหน้าทำการยกเลิกสักครู่",
        });
        setReason("");
        await fetchData();
      }
      dispatch(loadingAction(false));
    }
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "no",
      key: "no",
      align: "center",
      width: 50,
    },
    {
      title: "รหัสนายหน้า",
      dataIndex: "cuscode",
      key: "cuscode",
      align: "center",
      width: 200,
    },
    {
      title: "ชื่อตรอ.",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 200,
    },
    {
      title: "รหัสรายการ",
      dataIndex: "quo_num",
      key: "quo_num",
      align: "center",
      width: 200,
    },
    {
      title: "วันที่ทำรายการ",
      dataIndex: "datestart",
      key: "datestart",
      align: "center",
      width: 200,
    },
    {
      title: "ทะเบียนรถ",
      dataIndex: "idCar",
      key: "idCar",
      align: "center",
      width: 200,
    },
    {
      title: "ยกเลิก",
      dataIndex: "cancel",
      key: "cancel",
      align: "center",
      render: (text, record) => {
        return (
          <>
            <Button
              className="remove-btn"
              width="100"
              onClick={() => {
                modal.current.open();
                setCancelQuoNum(record.quo_num);
              }}
            >
              ยกเลิก
            </Button>
          </>
        );
      },
    },
  ];

  return (
    <Container className="report-container">
      <Box>
        <Label className="title-form">รายการกรมธรรม์</Label>
        <Box className="report-wrapper">
          <Box className="filter-box-wrapper">
            <Label className="title-second-form" noLine>
              กรองข้อมูล
            </Label>
            <Box className="filter-box">
              <Box className="filter-input" width="200">
                <Label>ค้นหา</Label>
                <Input
                  name="search"
                  placeholder="ค้นหา"
                  isNotForm
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Box>
            </Box>
          </Box>
          <Box className="report-table">
            <Table
              columns={columns}
              dataSource={data}
              className="report-data-table"
              size="middle"
            />
          </Box>
          <ModalCustom
            ref={modal}
            okText="ใช่"
            cancelText="ไม่"
            onCallback={handleClickCancel}
            headerText="ต้องการจะยกเลิกกรมธรรม์หรือไม่"
            modalHead="modal-header-red"
            iconsClose={
              <Icons.CloseOutlined style={{ color: THEME.COLORS.WHITE }} />
            }
          >
            <Box className="slip-print">
              <Label>{cancelQuoNum}</Label>
              <Label style={{ marginBottom: "5px", marginTop: "10px" }}>
                เหตุผลการขอยกเลิกกรมธรรม์
              </Label>
              <Input
                placeholder="เหตุผล"
                onChange={(e) => setReason(e.target.value)}
              />
            </Box>
          </ModalCustom>
        </Box>
      </Box>
    </Container>
  );
};

export default AllInsurance;
