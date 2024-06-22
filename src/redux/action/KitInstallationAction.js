import {
  AddLocation_API,
  EnterManuallyKit_API,
  GetLocation_API,
  InstallKitDetails_API,
  NotFoundKit_API,
} from "../../config/urls";

import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance, { makeFormDataRequest } from "../../utils/services";

export const call_InstallKitDetails = createAsyncThunk(
  "getInstallKitDetails",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("***** 11getInstallKitDetails", credentials);
      const response = await axiosInstance.get(InstallKitDetails_API, {
        params: credentials,
      });
      // console.log("response***** 11getInstallKitDetails", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_EnterManuallyKit = createAsyncThunk(
  "EnterManuallyKit",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("*****", credentials);
      const response = await makeFormDataRequest(
        EnterManuallyKit_API,
        "post",
        credentials
      );
      // console.log("response*****", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_AddBarcodeItem_Kit = createAsyncThunk(
  "AddBarcodeItem_Kit",
  async (formData, { rejectWithValue }) => {
    try {
      // console.log("***** AdminRegisterUser_API", JSON.stringify(formData));
      const response = await makeFormDataRequest(
        EnterManuallyKit_API,
        "post",
        formData
      );
      // console.log("response***** AdminRegisterUser_API", response);
      return response.data;
    } catch (error) {
      // console.log("error***** AdminRegisterUser_API", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_AddItem_Kit = createAsyncThunk(
  "AddItem",
  async (credentials, { rejectWithValue }) => {
    try {
      // console.log("*****add item", EnterManuallyKit_API, credentials);
      const response = await axiosInstance.post(
        EnterManuallyKit_API,
        credentials
      );
      // console.log("response***** add item", response);
      // console.log("====response data ========", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_NotFoundKit_API = createAsyncThunk(
  "NotFoundKit",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("***** call_NotFoundKit_API", JSON.stringify(formData));
      const response = await makeFormDataRequest(
        NotFoundKit_API,
        "post",
        formData
      );
      // console.log("response***** call_NotFoundKit_API", response);
      return response.data;
    } catch (error) {
      console.log("err call_NotFoundKit_API", error.response);
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_GetLocation_API = createAsyncThunk(
  "getLocation",
  async (res, { rejectWithValue }) => {
    try {
      // console.log(res, "***** GetLocation_API");
      const response = await axiosInstance.get(GetLocation_API);
      // console.log("response***** GetLocation_API", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const call_AddLocation_API = createAsyncThunk(
  "AddLocation",
  async (formData, { rejectWithValue }) => {
    try {
      // console.log("***** AddLocation", JSON.stringify(formData));
      const response = await makeFormDataRequest(
        AddLocation_API,
        "post",
        formData
      );
      // console.log("response***** AddLocation", response);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);