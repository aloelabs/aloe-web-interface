const DEVMODE: boolean = (process.env.REACT_APP_ENV === "development");
const IS_DEV = DEVMODE;
const IS_PROD = !DEVMODE;

export {
  IS_DEV,
  IS_PROD,
}
