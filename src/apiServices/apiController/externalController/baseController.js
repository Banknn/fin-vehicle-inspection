import apiService from "../../apiService";
import { PATH } from "./constants";

export const baseController = (configService) => {
  const service = apiService(configService);
  return {
    getPriceAuto: (params) => {
      return service.post({
        url: `${PATH.DEFAULT}/pricelist/get_price_auto`,
        body: { ...params },
      });
    },
    generateNewCouponPromotion: (params) => {
      return service.post({
        url: `${PATH.DEFAULT}/coupon/generateNewCouponPromotion`,
        body: { ...params, code: 'FDP' },
      });
    },
    savePoint: (params) => {
      return service.post({
        url: `${PATH.DEFAULT}/luckywheel/save_point`,
        body: { ...params, flow: 'New', type: 'receive', platform: 'WEB' },
      });
    },
  };
};
