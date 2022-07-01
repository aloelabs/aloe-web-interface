const DEVMODE: boolean = (process.env.REACT_APP_ENV === "development");
const IS_DEV = DEVMODE;
const IS_PROD = !DEVMODE;

console.log(`Devmode? ${IS_DEV}`);

export {
  IS_DEV,
  IS_PROD,
}
