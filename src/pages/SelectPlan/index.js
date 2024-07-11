import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { loadingAction } from "../../actions";
import { systemController } from "../../apiServices";
import { Box, Label, Image, Button } from "../../components";
import {
  convertStrToFormat,
  isValidResponse,
  numberWithCommas,
  redirect,
  ROUTE_PATH,
} from "../../helpers";
import { THEME } from "../../themes";
import { DetailLayout } from "../Layout/DetailLayout";
import _ from "lodash";

const SelectPlan = () => {
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.customerReducer);
  const [planDetail, setPlanDetail] = useState({});
  const [selectedPlanList, setSelectedPlanList] = useState([]);

  const fetchData = useCallback(async () => {
    dispatch(loadingAction(false));
    if(!_.isEmpty(customer)){
      const params = {
        quo_num: customer.quoNum,
        cuscode: customer.cuscode,
      };
      const API = systemController();
      const res = await API.getWaitByQuo(params);
      if (isValidResponse(res)) {
        const selectedPlan = res.result;
        const numPlan = selectedPlan.plans.length
        if (numPlan > 1 && numPlan !== 0) {
          setPlanDetail(selectedPlan);
          setSelectedPlanList(selectedPlan.plans);
        } else {
          redirect(ROUTE_PATH.CAR_INSURANCE.LINK);
        }
      }
    }
  }, [dispatch, customer]);

  const handleClickSelect = (e) => {
    Modal.confirm({
      title: "คุณต้องการเลือกแผนประกันรถนี้หรือไม่",
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const { quo_num } = planDetail;
        const {
          p_name,
          assured_insurance_capital1,
          amount_inc,
          amount_inc_prb,
          company,
          deductible,
        } = e;
        const params = {
          quo_num,
          cusnop: p_name,
          assured_insurance_capital1,
          amount_inc,
          amount_inc_prb,
          company,
          deductible,
        };
        const API = systemController();
        const res = await API.updateSelectPlan(params);
        if (isValidResponse(res)) {
          dispatch(loadingAction(true));
          redirect(ROUTE_PATH.CAR_INSURANCE.LINK);
        }
      },
      onCancel: () => {},
      okText: "ยืนยัน",
      cancelText: "ยกเลิก",
    });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DetailLayout>
      <Label className="title-form">ประกันรถยนต์</Label>
      <Box>
        <Label className="title-second-form">เลือกแพ็คเกจประกันรถยนต์</Label>
        {selectedPlanList.map((e, i) => {
          return (
            <Box className="card-list-wrapper" key={i}>
              <Box className="company-card-wrapper">
                <Image
                  src={e.company_url}
                  className="brand-img"
                  alt={e.company}
                />
                <Label>{e.company}</Label>
                <Button
                  className="accept-btn"
                  onClick={() => handleClickSelect(e)}
                >
                  เลือก
                </Button>
              </Box>
              <Box className="company-detail-card-wrapper">
                <Box>
                  <Box className="price-detail">
                    <Label className="price-description">ราคาเบี้ย</Label>
                    <Label
                      className="price-description"
                      color={THEME.COLORS.TEXT_RED}
                    >
                      {convertStrToFormat(e.amount_inc, "money_digit")} บาท
                    </Label>
                  </Box>
                  <Box className="price-detail">
                    <Label className="price-description">ทุนประกัน</Label>
                    <Label className="price-description">
                      {numberWithCommas(
                        e.assured_insurance_capital1,
                        "money_digit"
                      )}{" "}
                      บาท
                    </Label>
                  </Box>
                  {/* <Label className='plan-description'>ดูความคุ้มครอง</Label> */}
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>
    </DetailLayout>
  );
};
export default SelectPlan;
