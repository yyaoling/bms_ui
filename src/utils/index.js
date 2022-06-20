import XLSX from "xlsx";

export function readFileForWorkbook(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    let wb;
    reader.onload = res => {
      const data = res.target.result;
      wb = XLSX.read(data, {
        type: "binary"
      });
      resolve(wb);
    };
    reader.onerror = e => {
      reject(e);
    };
    reader.readAsBinaryString(file);
  });
}

export function analysisWorkbook(type, workbook) {
  let list = [];
  let fun = null;
  switch (type) {
    case "csv":
      fun = XLSX.utils.sheet_to_csv;
      break;
    case "txt":
      fun = XLSX.utils.sheet_to_txt;
      break;
    case "html":
      fun = XLSX.utils.sheet_to_html;
      break;
    case "formulae":
      fun = XLSX.utils.sheet_to_formulae;
      break;
    default:
      fun = XLSX.utils.sheet_to_json;
      break;
  }
  workbook.SheetNames.forEach(sheet => {
    const ref = workbook.Sheets[sheet]["!ref"];
    if (ref) {
      list = list.concat(fun(workbook.Sheets[sheet]));
    }
  });
  return list;
}

export function exportExcel(data) {
  const filename = "users.xlsx";
  const ws_name = "users";
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, ws_name);
  XLSX.writeFile(wb, filename);
}
