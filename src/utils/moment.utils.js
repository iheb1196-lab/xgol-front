import moment from "moment";

export const getDuration = (dateTime) => {
  return moment(dateTime).fromNow();
};