import request from "@/request";

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

// book
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

export const getBook = (isbn) => request({
  url: `/api/books/${isbn}`,
  method: 'GET',
})

export const getCommentList = (isbn) => request({
  url: `/api/books/${isbn}/comments`,
  method: 'GET',
})

export const getScoreList = (isbn) => request({
  url: `/api/books/${isbn}/scores`,
  method: 'GET',
})

export const getBookCount = (keyWord, tag) => request({
  url: `/api/books/count`,
  params: {
    keyWord: keyWord,
    tag: tag,
  },
  method: 'GET',
})

export const getRank = (rank) => request({
  url: `/api/books/rank`,
  params: {
    rank: rank,
  },
  method: 'GET',
})

export const checkBookExists = (isbn) => request({
  url: `/api/books/${isbn}/exists`,
  method: 'GET',
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

export const checkUserNameExists = (userName) => request({
  url: `/api/users/userName/${userName}/exists`,
  method: 'GET',
})

export const checkEmailExists = (email) => request({
  url: `/api/users/email/${email}/exists`,
  method: 'GET',
})

export const register = (user) => request({
  url: `/api/users/create`,
  data: user,
  method: 'POST',
})

export const updateUserInfo = (userName, user) => request({
  url: `/api/users/${userName}/update`,
  data: user,
  method: 'PUT',
})

export const updateAvatar = (userName, fileName) => request({
  url: `/api/users/${userName}/avatarImage/update`,
  params: {
    fileName: fileName
  },
  method: 'PUT',
})

export const updatePassword = (userName, password) => request({
  url: `/api/users/${userName}/password/update`,
  params: {
    password: password,
  },
  method: 'PUT',
})

export const updateEmail = (userName, email) => request({
  url: `/api/users/${userName}/email/update`,
  params: {
    email: email,
  },
  method: 'PUT',
})

// record
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

export const getRecordNotReturn = (keyWord, userName) => request({
  url: `/api/records/notReturn`,
  params: {
    keyWord: keyWord,
    userName: userName,
  },
  method: 'GET',
})

export const checkRecordExists = (userName, isbn) => request({
  url: `/api/records/check/${userName}/${isbn}`,
  method: 'GET',
})

export const getRecord = (userName, isbn) => request({
  url: `/api/records/${userName}/${isbn}`,
  method: 'GET',
})

// tag
export const getTagList = () => request({
  url: `/api/tags`,
  method: 'GET',
})

// application
export const checkBorrowApplicationExists = (userName, isbn) => request({
  url: `/api/applications/borrow/${userName}/${isbn}`,
  method: 'GET',
})

export const checkApplicationExists = (userName, isbn) => request({
  url: `/api/applications/all/${userName}/${isbn}`,
  method: 'GET',
})

export const applyForBorrow = (application) => request({
  url: `/api/applications/borrow/create`,
  data: application,
  method: 'POST',
})

export const applyForRenew = (application) => request({
  url: `/api/applications/renew/create`,
  data: application,
  method: 'POST',
})

export const applyForReturn = (application) => request({
  url: `/api/applications/return/create`,
  data: application,
  method: 'POST',
})

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
