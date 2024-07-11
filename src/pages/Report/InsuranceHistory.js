import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";
import { pdfController, reportController } from "../../apiServices";
import {
  Box,
  Button,
  Container,
  Input,
  DatePicker,
  Label,
  Table,
} from "../../components";
import { isValidResponse } from "../../helpers";
import { loadingAction } from "../../actions";

const InsuranceHistory = () => {
  const dispatch = useDispatch();
  const [historyData, setHistoryData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");

  const fetchData = useCallback(
    async (start, end) => {
      dispatch(loadingAction(true));
      const dateNow = new Date();
      const currDaySt = moment(start || moment().startOf('month')).format("DD");
      const currMonthSt = moment(start || dateNow).format("MM");
      const currYearSt = moment(start || dateNow).format("YYYY");
      const currDayEn = moment(end || dateNow).format("DD");
      const currMonthEn = moment(end || dateNow).format("MM");
      const currYearEn = moment(end || dateNow).format("YYYY");

      const startDate = moment(
        `${currYearSt}-${currMonthSt}-${currDaySt} 00:00:00`
      ).format("YYYY-MM-DD HH:mm:ss");
      const endDate = moment(
        `${currYearEn}-${currMonthEn}-${currDayEn} 23:59:59`
      ).format("YYYY-MM-DD HH:mm:ss");

      const params = {
        startDate: start || startDate,
        endDate: end || endDate,
      };
      const API = reportController();
      const res = await API.getHistory(params);
      if (isValidResponse(res)) {
        dispatch(loadingAction(false));
        const dataList = res.result;
        const data = dataList.map((e, i) => {
          return {
            key: i,
            no: i + 1,
            quo_num: e.quo_num,
            datestart: moment(e.datestart).format("DD/MM/YYYY"),
            name: `${e.name} ${e.lastname}`,
            idcar: e.idcar,
            carprovince: e.carprovince,
            insure: e.bill_copyinsurance,
            insureWaterMark: e.bill_copyinsurance_mk,
            prb: e.bill_copyprb,
            status: e.status,
            prbPolicy: e.prb_policy,
            prbInvoice: e.prb_invoice,
            insurPolicy: e.insur_policy,
          };
        });

        setHistoryData(data);
        setStartDate(moment(startDate));
        setEndDate(moment(endDate));
      }
    },
    [dispatch]
  );

  const handleFilter = async () => {
    const start = moment(startDate).format("YYYY-MM-DD");
    const end = moment(endDate).format("YYYY-MM-DD");
    if (startDate && endDate) {
      await fetchData(`${start} 00:00:00`, `${end} 23:59:59`);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "no",
      key: "no",
      align: "center",
      width: 50,
    },
    {
      title: "เลขที่รายการ",
      dataIndex: "quo_num",
      key: "quo_num",
      align: "center",
      width: 200,
    },
    {
      title: "วันที่แจ้งงาน",
      dataIndex: "datestart",
      key: "datestart",
      align: "center",
      width: 200,
    },
    {
      title: "ชื่อลูกค้า",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "ทะเบียนรถ",
      dataIndex: "idcar",
      key: "idcar",
      align: "center",
    },
    {
      title: "จังหวัดป้ายทะเบียน",
      dataIndex: "carprovince",
      key: "carprovince",
      align: "center",
    },
    {
      title: "กรมธรรม์",
      dataIndex: "insure",
      key: "insure",
      align: "center",
      render: (text) => {
        return text ? (
          <Label className="download" onClick={() => window.open(text)}>
            ดาวน์โหลด
          </Label>
        ) : (
          <Label>-</Label>
        );
      },
    },
    {
      title: "กรมธรรม์ (ลายน้ำ)",
      dataIndex: "insureWaterMark",
      key: "insureWaterMark",
      align: "center",
      render: (text) => {
        return text ? (
          <Label className="download" onClick={() => window.open(text)}>
            ดาวน์โหลด
          </Label>
        ) : (
          <Label>-</Label>
        );
      },
    },
    {
      title: "พ.ร.บ.",
      dataIndex: "prb",
      key: "prb",
      align: "center",
      render: (text, record, index) => {
        const downloadFile = async () => {
          window.open(record.prbPolicy);
          const params = {
            quo_num: record.quo_num,
            prb_policy: record.prbPolicy,
          };
          const API = pdfController();
          await API.uploadFiletoSpaceAgain(params);
        };
        return text ? (
          <Label className="download" onClick={() => window.open(text)}>
            ดาวน์โหลด
          </Label>
        ) : record.prbPolicy ? (
          <Label className="download" onClick={downloadFile}>
            ดาวน์โหลดอีกครั้ง
          </Label>
        ) : (
          <Label className="download">-</Label>
        );
      },
    },
  ];

  const dataList = historyData.filter(
    (e) =>
      e.quo_num.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
      e.name.toLowerCase().indexOf(search.toLowerCase()) !== -1 ||
      e.idcar.toLowerCase().indexOf(search.toLowerCase()) !== -1
  );

  return (
    <>
      <Container className="report-container">
        <Box>
          <Label className="title-form">ประวัติการออกกรมธรรม์</Label>
          <Box className="report-wrapper">
            <Box className="filter-box-wrapper">
              <Label className="title-second-form" noLine>
                กรองข้อมูล
              </Label>
              <Box className="filter-box">
                <Box className="filter-input" width="200">
                  <Label>วันที่</Label>
                  <DatePicker
                    placeholder="วันที่"
                    name="startDate"
                    format="DD/MM/YYYY"
                    onChange={(e) => setStartDate(e)}
                    value={moment(startDate)}
                    notvalue
                  />
                </Box>
                <Box className="filter-input" width="200">
                  <Label>ถึงวันที่</Label>
                  <DatePicker
                    placeholder="วันที่"
                    name="endDate"
                    format="DD/MM/YYYY"
                    onChange={(e) => setEndDate(e)}
                    value={moment(endDate)}
                    notvalue
                  />
                </Box>
                <Box className="filter-input" width="200">
                  <Label>ค้นหา</Label>
                  <Input
                    name="search"
                    placeholder="ค้นหา"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </Box>
                <Box className="filter-input" width="200">
                  <Button className="select-btn" onClick={handleFilter}>
                    <SearchOutlined style={{ marginRight: "5px" }} />
                    ค้นหา
                  </Button>
                </Box>
              </Box>
            </Box>
            <Box className="report-table">
              <Table
                columns={columns}
                dataSource={dataList}
                className="report-data-table"
                size="middle"
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};
export default InsuranceHistory;
