import request from "@/request";
import axios from "axios";
export const uploadAvatar = (fileName, file) => {
  var COS = require('cos-js-sdk-v5');
  var cos = new COS({
    SecretId: 'AKIDc4FAoCJ9i00jBMGtGfT4OTHo55oGSO3Q',
    SecretKey: '8zauxjESQ8alfIdiV1GEwOZU8UZOxEEx'
  });
  cos.putObject({
    Bucket: 'bms-1302010632',
    Region: 'ap-nanjing',
    Key: fileName,
    StorageClass: 'STANDARD',
    Body: file,
  });
}

//在线添加图书

export const serchBookOnline = (isbn) => {
  let url = 'https://api.jike.xyz/situ/book/isbn/' + isbn + '?apikey=12747.0404a989e5c606807c5c23ed68c2e5b6.056f2805f6ba8165993e897a9d0e183a'
  //console.log(url)
  return axios.get(url)
}

export const uploadCover = (fileName, file) => {
  var COS = require('cos-js-sdk-v5');
  var cos = new COS({
    SecretId: 'AKIDc4FAoCJ9i00jBMGtGfT4OTHo55oGSO3Q',
    SecretKey: '8zauxjESQ8alfIdiV1GEwOZU8UZOxEEx'
  });
  cos.putObject({
    Bucket: 'bms-1302010632',
    Region: 'ap-nanjing',
    Key: fileName,
    StorageClass: 'STANDARD',
    Body: file,
  });
}

// book
export const getBookCount = (keyWord, tag) => request({
  url: `/api/books/count`,
  params: {
    keyWord: keyWord,
    tag: tag,
  },
  method: 'GET',
})

export const getBookList = (keyWord, tag, page, pageSize) => request({
  url: `/api/books`,
  params: {
    keyWord: keyWord,
    tag: tag,
    page: page,
    pageSize: pageSize,
  },
  method: 'GET',
})

export const checkBookExists = (isbn) => request({
  url: `/api/books/${isbn}/exists`,
  method: 'GET',
})

export const getBook = (isbn) => request({
  url: `/api/books/${isbn}`,
  method: 'GET',
})

export const deleteBook = (isbn) => request({
  url: `/api/books/${isbn}/delete`,
  method: 'DELETE',
})

export const addBook = (book) => request({
  url: `/api/books/create`,
  data: book,
  method: 'POST',
})

export const updateBook = (isbn, book) => request({
  url: `/api/books/${isbn}/update`,
  data: book,
  method: 'PUT',
})

// user
export const login = (userName, password) => request({
  url: `/api/users/${userName}/password/check`,
  params: {
    password: password,
  },
  method: 'GET',
})

export const getUserInfo = (userName) => request({
  url: `/api/users/${userName}`,
  method: 'GET',
})

export const getUserCount = (keyWord) => request({
  url: `/api/users/count`,
  params: {
    keyWord: keyWord,
  },
  method: 'GET',
})

export const getUserList = (keyWord, page, pageSize) => request({
  url: `/api/users`,
  params: {
    keyWord: keyWord,
    page: page,
    pageSize: pageSize,
  },
  method: 'GET',
})

export const checkUserExists = (userName) => request({
  url: `/api/users/userName/${userName}/exists`,
  method: 'GET',
})

export const deleteUser = (userName) => request({
  url: `/api/users/${userName}/delete`,
  method: 'DELETE',
})

export const disableUser = (userName) => request({
  url: `/api/users/${userName}/disable`,
  method: 'PUT',
})

export const recoverUser = (userName) => request({
  url: `/api/users/${userName}/recover`,
  method: 'PUT',
})

export const updatePassword = (userName, password) => request({
  url: `/api/users/${userName}/password/update`,
  params: {
    password: password,
  },
  method: 'PUT',
})

export const disableUsers = (userNameList) => request({
  url: `/api/users/disable`,
  data: userNameList,
  method: 'PUT',
})

export const recoverUsers = (userNameList) => request({
  url: `/api/users/recover`,
  data: userNameList,
  method: 'PUT',
})

export const updateAvatar = (userName, fileName) => request({
  url: `/api/users/${userName}/avatarImage/update`,
  params: {
    fileName: fileName
  },
  method: 'PUT',
})

export const checkEmailExists = (email) => request({
  url: `/api/users/email/${email}/exists`,
  method: 'GET',
})

export const updateUserInfo = (userName, user) => request({
  url: `/api/users/${userName}/update`,
  data: user,
  method: 'PUT',
})

export const importUsers = (users) => request({
  url: `/api/users/import`,
  data: users,
  method: 'POST',
})

// record
export const addRecord = (record) => request({
  url: `/api/records/create`,
  data: record,
  method: 'POST',
})

export const renewRecord = (rid, expectDateTime) => request({
  url: `/api/records/${rid}/renew`,
  params: {
    expectDateTime: expectDateTime,
  },
  method: 'PUT',
})

export const returnRecord = (rid, score, comment) => request({
  url: `/api/records/${rid}/return`,
  params: {
    score: score,
    comment: comment,
  },
  method: 'PUT',
})

export const getRecordCount = (keyWord, userName, state) => request({
  url: `/api/records/count`,
  params: {
    keyWord: keyWord,
    userName: userName,
    state: state,
  },
  method: 'GET',
})

export const getRecordList = (keyWord, userName, state, page, pageSize) => request({
  url: `/api/records`,
  params: {
    keyWord: keyWord,
    userName: userName,
    state: state,
    page: page,
    pageSize: pageSize,
  },
  method: 'GET',
})

export const deleteRecord = (rid) => request({
  url: `/api/records/${rid}/delete`,
  method: 'DELETE',
})

// tag

// application
export const getBorrowApplicationCount = (keyWord, userName, state) => request({
  url: `/api/applications/borrow/count`,
  params: {
    keyWord: keyWord,
    userName: userName,
    state: state,
  },
  method: 'GET',
})

export const getBorrowApplicationList = (keyWord, userName, state, page, pageSize) => request({
  url: `/api/applications/borrow`,
  params: {
    keyWord: keyWord,
    userName: userName,
    state: state,
    page: page,
    pageSize: pageSize,
  },
  method: 'GET',
})

export const deleteBorrowApplication = (aid) => request({
  url: `/api/applications/borrow/${aid}/delete`,
  method: 'DELETE',
})

export const acceptBorrowApplication = (aid) => request({
  url: `/api/applications/borrow/${aid}/accept`,
  method: 'PUT',
})

export const rejectBorrowApplication = (aid) => request({
  url: `/api/applications/borrow/${aid}/reject`,
  method: 'PUT',
})

export const getRenewApplicationCount = (keyWord, userName, state) => request({
  url: `/api/applications/renew/count`,
  params: {
    keyWord: keyWord,
    userName: userName,
    state: state,
  },
  method: 'GET',
})

export const getRenewApplicationList = (keyWord, userName, state, page, pageSize) => request({
  url: `/api/applications/renew`,
  params: {
    keyWord: keyWord,
    userName: userName,
    state: state,
    page: page,
    pageSize: pageSize,
  },
  method: 'GET',
})

export const deleteRenewApplication = (aid) => request({
  url: `/api/applications/renew/${aid}/delete`,
  method: 'DELETE',
})

export const acceptRenewApplication = (aid) => request({
  url: `/api/applications/renew/${aid}/accept`,
  method: 'PUT',
})

export const rejectRenewApplication = (aid) => request({
  url: `/api/applications/renew/${aid}/reject`,
  method: 'PUT',
})

export const getReturnApplicationCount = (keyWord, userName, state) => request({
  url: `/api/applications/return/count`,
  params: {
    keyWord: keyWord,
    userName: userName,
    state: state,
  },
  method: 'GET',
})

export const getReturnApplicationList = (keyWord, userName, state, page, pageSize) => request({
  url: `/api/applications/return`,
  params: {
    keyWord: keyWord,
    userName: userName,
    state: state,
    page: page,
    pageSize: pageSize,
  },
  method: 'GET',
})

export const deleteReturnApplication = (aid) => request({
  url: `/api/applications/return/${aid}/delete`,
  method: 'DELETE',
})

export const acceptReturnApplication = (aid) => request({
  url: `/api/applications/return/${aid}/accept`,
  method: 'PUT',
})

export const rejectReturnApplication = (aid) => request({
  url: `/api/applications/return/${aid}/reject`,
  method: 'PUT',
})

// token
export const getToken = (userName, password) => request({
  url: `/api/tokens`,
  params: {
    userName: userName,
    password: password,
  },
  method: 'GET',
})

export const resolveToken = (token) => request({
  url: `/api/tokens/resolve`,
  params: {
    token: token,
  },
  method: 'GET',
})

export const checkToken = (token) => request({
  url: `/api/tokens/check`,
  params: {
    token: token,
  },
  method: 'GET',
})

//获得图书分类图表数据
export const getBookCategories = () => request({
  url: `/api/books/getBookCategories`,
  method: 'GET',
})

