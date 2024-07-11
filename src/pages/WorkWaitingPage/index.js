import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import moment from "moment";
import { Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Box, Button, Label, Table } from "../../components";
import { isValidResponse, redirect, ROUTE_PATH } from "../../helpers";
import { DetailLayout } from "../Layout/DetailLayout";
import { carController, systemController } from "../../apiServices";
import { customerAction, loadingAction } from "../../actions";

const WorkWaitingPage = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [customerList, setCustomerList] = useState([]);
  const [checkFetch, setCheckFetch] = useState(false);

  const fetchData = useCallback(async () => {
    const API = systemController();
    const res = await API.getWaitAll();
    if (isValidResponse(res)) {
      dispatch(loadingAction(false));
      const datas = res.result;
      const dataList = datas.filter(
        (e) =>
          e.status === "wait" &&
          e.type_status === "auto" &&
          e.type_insure === "ตรอ"
      );
      setCustomerList(dataList);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData, checkFetch]);

  return (
    <DetailLayout isPreve={true} onClickPrevious={() => history.goBack()}>
      <Label className="title-form">รายการรอแจ้งงาน</Label>
      <Box>
        <Box className="new-work-btn-group">
          <Button
            className="new-work-btn"
            onClick={() => redirect(ROUTE_PATH.VEHICLE_SELECTION.LINK)}
          >
            เช็คเบี้ยออโต้
          </Button>
          <Button
            className="new-work-btn"
            onClick={() => redirect(ROUTE_PATH.CAR_INSURANCE.LINK)}
          >
            <PlusOutlined />
            สร้างรายการใหม่
          </Button>
        </Box>
        <WaitingTable
          datas={customerList}
          checkFetch={checkFetch}
          setCheckFetch={setCheckFetch}
        />
      </Box>
    </DetailLayout>
  );
};
export default WorkWaitingPage;

const WaitingTable = ({ datas, checkFetch, setCheckFetch }) => {
  const dispatch = useDispatch();
  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "no",
      align: "center",
    },
    {
      title: "ชื่อ - นามสกุล",
      dataIndex: "name",
      align: "center",
    },
    {
      title: "เลขรายการ",
      dataIndex: "quoNum",
      align: "center",
    },
    {
      title: "เบอร์โทร",
      dataIndex: "tel",
      align: "center",
    },
    {
      title: "ประเภท",
      dataIndex: "type",
      align: "center",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      align: "center",
    },
    {
      title: "วันที่ออกใบเสนอราคา",
      dataIndex: "date",
      align: "center",
    },
    {
      title: "รับงาน",
      dataIndex: "select",
      align: "center",
      render: (text, row, index) => {
        const handleClickSelect = async () => {
          const API = carController();
          const res = await API.getAllIdCarByQuoNum(row.quo_num);
          if (isValidResponse(res)) {
            const {
              id_brand,
              id_series,
              id_subseries,
              id_year,
              brands,
              series,
              sub_series,
              year,
            } = res.result[0];
            const customer = {
              quoNum: row.quo_num,
              idBrand: id_brand,
              idSeries: id_series,
              idSubseries: id_subseries,
              idYear: id_year,
              brand: brands,
              series,
              subSeries: sub_series,
              year,
            };

            dispatch(customerAction(customer));
            dispatch(loadingAction(true));
            redirect(ROUTE_PATH.SELECT_PLAN.LINK);
          }
        };
        return (
          <Box>
            <Button
              onClick={handleClickSelect}
              className="select-btn"
              width="60"
            >
              เลือก
            </Button>
          </Box>
        );
      },
    },
    {
      title: "นำออก",
      dataIndex: "delete",
      align: "center",
      render: (text, row, index) => {
        const handleClickDelete = () => {
          const { quo_num } = row;
          Modal.confirm({
            title: "ยืนยันที่จะลบงานนี้หรือไม่?",
            onOk: async () => {
              const API = systemController();
              const res = await API.deleteWaitByQuo(quo_num);
              if (isValidResponse(res)) {
                Modal.success({
                  title: `ลบ ${quo_num} สำเร็จ`,
                  okText: "ตกลง",
                });
                setCheckFetch(!checkFetch);
              }
            },
          });
        };
        return (
          <Box>
            <Button
              className="remove-btn"
              width="60"
              onClick={handleClickDelete}
            >
              ลบ
            </Button>
          </Box>
        );
      },
    },
  ];

  const dataSource = datas.map((e, i) => {
    return {
      key: i,
      no: i + 1,
      name: `${e.title} ${e.name} ${e.lastname}`,
      quoNum: e.quo_num,
      tel: e.tel,
      type: e.type_status,
      status: e.status,
      date: moment(e.datestart).format("DD/MM/YYYY"),
      select: e.quo_num,
      delete: e.quo_num,
      ...e,
    };
  });

  return (
    <Table
      className="waiting-work-wrapper"
      columns={columns}
      dataSource={dataSource}
    />
  );
};
