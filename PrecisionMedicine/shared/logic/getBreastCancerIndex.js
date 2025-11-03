/**
 *  This function is used to get the index of the breast cancer type
 *  This is used to preselect the cancer type to breast cancer
 */
export const getBreastCancerIndex = (cancerTypes) => {
  return cancerTypes?.findIndex(
    (element) => element.toLowerCase() === "breast cancer"
  );
};
