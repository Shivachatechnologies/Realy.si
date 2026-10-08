export function fmt(value, format, suffix = "") {
  let out;
  switch (format) {
    case "currency": out = "$" + Math.round(value).toLocaleString("en-US"); break;
    case "percent": out = Math.round(value) + "%"; break;
    case "percent1": out = Number(value).toFixed(1) + "%"; break;
    default: out = Math.round(value).toLocaleString("en-US");
  }
  return out + suffix;
}
