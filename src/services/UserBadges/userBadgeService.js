import { axiosClients } from "../../apis/axiosClients";

export const assignBadge = async (badgeId) => {
  return await axiosClients
    .post(`/userBadges/assign`, { badge_id: badgeId })
    .then((res) => {
      return res.data;
    });
};
